import { STORAGE_BUCKETS } from "@/lib/config";
import {
  fallbackArticles,
  fallbackGuestbook,
  fallbackMoments,
  fallbackPhotos,
  fallbackSettings,
  fallbackTracks,
} from "@/lib/fallback";
import { createServerSupabase } from "@/lib/supabase/server";
import type {
  Article,
  GuestbookMessage,
  MomentImage,
  MomentPost,
  Photo,
  SiteSettings,
  StaffProfile,
  Track,
  UserRow,
} from "@/types/database";

function publicUrl(
  supabase: NonNullable<Awaited<ReturnType<typeof createServerSupabase>>>,
  bucket: string,
  path: string | null,
) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

function toSettings(
  user: UserRow,
  links: { platform: string; url: string | null }[],
): SiteSettings {
  const byPlatform = Object.fromEntries(links.map((row) => [row.platform, row.url]));
  return {
    id: user.id,
    site_title: user.site_title,
    owner_display_name: user.display_name,
    bio: user.bio,
    mood: user.mood,
    avatar_url: user.avatar_url,
    instagram_url: byPlatform.instagram ?? null,
    x_url: byPlatform.x ?? null,
    tiktok_url: byPlatform.tiktok ?? null,
    youtube_url: byPlatform.youtube ?? null,
    hit_count: user.hit_count,
    today_count: user.today_count,
    today_date: user.today_date,
    updated_at: user.updated_at,
  };
}

async function getRoomUser(
  supabase: NonNullable<Awaited<ReturnType<typeof createServerSupabase>>>,
) {
  const { data: owner } = await supabase
    .from("users")
    .select("*")
    .eq("role", "owner")
    .limit(1)
    .maybeSingle();
  if (owner) return owner as UserRow;
  const { data: anyUser } = await supabase.from("users").select("*").limit(1).maybeSingle();
  return (anyUser as UserRow | null) ?? null;
}

export async function getSettings(): Promise<SiteSettings> {
  const supabase = await createServerSupabase();
  if (!supabase) return fallbackSettings;
  const user = await getRoomUser(supabase);
  if (!user) return fallbackSettings;
  const { data: links } = await supabase
    .from("social_links")
    .select("platform, url")
    .order("sort_order");
  return toSettings(user, links ?? []);
}

export async function getTracks(includeInactive = false): Promise<Track[]> {
  const supabase = await createServerSupabase();
  if (!supabase) return fallbackTracks.filter((t) => t.is_active || includeInactive);
  let query = supabase.from("music").select("*").order("sort_order");
  if (!includeInactive) query = query.eq("is_active", true);
  const { data } = await query;
  return ((data ?? []) as { id: string; title: string; url: string; sort_order: number; is_active: boolean }[]).map(
    (row) => ({
      id: row.id,
      title: row.title,
      external_url: row.url,
      sort_order: row.sort_order,
      is_active: row.is_active,
    }),
  );
}

export async function getPhotos(includeHidden = false): Promise<Photo[]> {
  const supabase = await createServerSupabase();
  if (!supabase) return fallbackPhotos;
  let query = supabase.from("photos").select("*").order("created_at", { ascending: false });
  if (!includeHidden) query = query.eq("is_hidden", false);
  const { data } = await query;
  return ((data ?? []) as Omit<Photo, "public_url">[]).map((row) => ({
    ...row,
    public_url: publicUrl(supabase, STORAGE_BUCKETS.photos, row.storage_path) ?? "",
  }));
}

export async function getPhoto(id: string): Promise<Photo | null> {
  const photos = await getPhotos(true);
  return photos.find((p) => p.id === id && !p.is_hidden) ?? null;
}

export async function getMoments(includeHidden = false): Promise<MomentPost[]> {
  const supabase = await createServerSupabase();
  if (!supabase) return fallbackMoments;
  let query = supabase.from("moments").select("*").order("created_at", { ascending: false });
  if (!includeHidden) query = query.eq("is_hidden", false);
  const { data: moments } = await query;
  return (
    (moments ?? []) as {
      id: string;
      body: string;
      created_by: string | null;
      is_hidden: boolean;
      created_at: string;
      image_paths: string[] | null;
    }[]
  ).map((m) => ({
    id: m.id,
    body: m.body,
    created_by: m.created_by,
    is_hidden: m.is_hidden,
    created_at: m.created_at,
    images: (m.image_paths ?? []).map((storage_path, sort_order) => {
      const image: MomentImage = {
        id: `${m.id}-${sort_order}`,
        moment_id: m.id,
        storage_path,
        sort_order,
        public_url: publicUrl(supabase, STORAGE_BUCKETS.momentImages, storage_path) ?? "",
      };
      return image;
    }),
  }));
}

export async function getArticles(includeDrafts = false): Promise<Article[]> {
  const supabase = await createServerSupabase();
  if (!supabase) return fallbackArticles;
  let query = supabase
    .from("posts")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (!includeDrafts) query = query.eq("is_published", true);
  const { data } = await query;
  return ((data ?? []) as Omit<Article, "cover_url">[]).map((row) => ({
    ...row,
    cover_url: publicUrl(supabase, STORAGE_BUCKETS.articleCovers, row.cover_path),
  }));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = await createServerSupabase();
  if (!supabase) return fallbackArticles.find((a) => a.slug === slug) ?? null;
  const { data } = await supabase.from("posts").select("*").eq("slug", slug).maybeSingle();
  if (!data || !data.is_published) return null;
  return {
    ...(data as Omit<Article, "cover_url">),
    cover_url: publicUrl(supabase, STORAGE_BUCKETS.articleCovers, data.cover_path),
  };
}

export async function getGuestbook(includeHidden = false): Promise<GuestbookMessage[]> {
  const supabase = await createServerSupabase();
  if (!supabase) return fallbackGuestbook;
  let query = supabase.from("comments").select("*").order("created_at", { ascending: true });
  if (!includeHidden) query = query.eq("is_hidden", false);
  const { data } = await query;
  const rows = (data ?? []) as Omit<GuestbookMessage, "replies">[];
  const roots: GuestbookMessage[] = [];
  const map = new Map<string, GuestbookMessage>();
  for (const row of rows) {
    map.set(row.id, { ...row, replies: [] });
  }
  for (const row of rows) {
    const node = map.get(row.id)!;
    if (row.parent_id && map.has(row.parent_id)) {
      map.get(row.parent_id)!.replies.push(node);
    } else if (!row.parent_id) {
      roots.push(node);
    }
  }
  return roots.reverse();
}

export async function getStaff(): Promise<StaffProfile | null> {
  const supabase = await createServerSupabase();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("users")
    .select("id, role, display_name")
    .eq("id", user.id)
    .maybeSingle();
  return (data as StaffProfile | null) ?? null;
}

export async function requireStaff() {
  const staff = await getStaff();
  if (!staff) {
    throw new Error("需要登录管理室");
  }
  return staff;
}
