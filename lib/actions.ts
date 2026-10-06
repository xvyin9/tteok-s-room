"use server";

import { STORAGE_BUCKETS } from "@/lib/config";
import { requireStaff } from "@/lib/queries";
import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function revalidateSite() {
  revalidatePath("/", "layout");
  revalidatePath("/home");
  revalidatePath("/photos");
  revalidatePath("/moments");
  revalidatePath("/articles");
  revalidatePath("/guestbook");
  revalidatePath("/admin");
}

export async function incrementHits() {
  const supabase = await createServerSupabase();
  if (!supabase) return { hit_count: 1288, today_count: 12 };
  const { data, error } = await supabase.rpc("increment_hit_count");
  if (error) return { hit_count: 0, today_count: 0 };
  const row = Array.isArray(data) ? data[0] : data;
  return {
    hit_count: Number(row?.hit_count ?? 0),
    today_count: Number(row?.today_count ?? 0),
  };
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createServerSupabase();
  if (!supabase) {
    return { error: "还没接上 Supabase。请先填写 .env.local 并执行 SQL。" };
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "账号或密码不对哦" };
  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createServerSupabase();
  await supabase?.auth.signOut();
  redirect("/login");
}

export async function saveSettingsAction(formData: FormData) {
  const staff = await requireStaff();
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "Supabase 未配置" };
  const displayName =
    String(formData.get("owner_display_name") ?? "").trim() || "tteok";
  const payload = {
    site_title: String(formData.get("site_title") ?? "").trim() || "tteok's Memory Room",
    display_name: displayName,
    bio: String(formData.get("bio") ?? ""),
    mood: String(formData.get("mood") ?? ""),
    avatar_url: emptyToNull(formData.get("avatar_url")),
    updated_at: new Date().toISOString(),
  };
  const { data: owner } = await supabase
    .from("users")
    .select("id")
    .eq("role", "owner")
    .limit(1)
    .maybeSingle();
  const targetId = owner?.id ?? staff.id;
  const { error } = await supabase.from("users").update(payload).eq("id", targetId);
  if (error) return { error: error.message };

  const platforms = [
    ["instagram", formData.get("instagram_url")],
    ["x", formData.get("x_url")],
    ["tiktok", formData.get("tiktok_url")],
    ["youtube", formData.get("youtube_url")],
  ] as const;
  for (const [platform, value] of platforms) {
    const { error: linkError } = await supabase.from("social_links").upsert(
      {
        platform,
        url: emptyToNull(value),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "platform" },
    );
    if (linkError) return { error: linkError.message };
  }
  revalidateSite();
  return { ok: true };
}

export async function createPhotoAction(storagePath: string, caption: string) {
  const staff = await requireStaff();
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "Supabase 未配置" };
  const { error } = await supabase.from("photos").insert({
    storage_path: storagePath,
    caption,
    created_by: staff.id,
  });
  if (error) return { error: error.message };
  revalidateSite();
  return { ok: true };
}

export async function togglePhotoHiddenAction(id: string, isHidden: boolean) {
  await requireStaff();
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "Supabase 未配置" };
  const { error } = await supabase.from("photos").update({ is_hidden: isHidden }).eq("id", id);
  if (error) return { error: error.message };
  revalidateSite();
  return { ok: true };
}

export async function deletePhotoAction(id: string, storagePath: string) {
  await requireStaff();
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "Supabase 未配置" };
  await supabase.storage.from(STORAGE_BUCKETS.photos).remove([storagePath]);
  const { error } = await supabase.from("photos").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateSite();
  return { ok: true };
}

export async function createMomentAction(body: string, imagePaths: string[]) {
  const staff = await requireStaff();
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "Supabase 未配置" };
  const { error } = await supabase.from("moments").insert({
    body,
    created_by: staff.id,
    image_paths: imagePaths,
  });
  if (error) return { error: error.message };
  revalidateSite();
  return { ok: true };
}

export async function toggleMomentHiddenAction(id: string, isHidden: boolean) {
  await requireStaff();
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "Supabase 未配置" };
  const { error } = await supabase.from("moments").update({ is_hidden: isHidden }).eq("id", id);
  if (error) return { error: error.message };
  revalidateSite();
  return { ok: true };
}

export async function deleteMomentAction(id: string) {
  await requireStaff();
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "Supabase 未配置" };
  const { error } = await supabase.from("moments").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateSite();
  return { ok: true };
}

function slugify(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `${base || "note"}-${Date.now().toString(36)}`;
}

export async function saveArticleAction(formData: FormData) {
  const staff = await requireStaff();
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "Supabase 未配置" };
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  const cover_path = emptyToNull(formData.get("cover_path"));
  const is_published = formData.get("is_published") === "on";
  if (!title) return { error: "要写标题才行" };
  let published_at: string | null = null;
  if (is_published) {
    published_at = new Date().toISOString();
    if (id) {
      const { data: existing } = await supabase
        .from("posts")
        .select("published_at, is_published")
        .eq("id", id)
        .maybeSingle();
      if (existing?.is_published && existing.published_at) {
        published_at = existing.published_at;
      }
    }
  }
  const payload = {
    title,
    body,
    cover_path,
    is_published,
    published_at,
  };
  if (id) {
    const { error } = await supabase.from("posts").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("posts").insert({
      ...payload,
      slug: slugify(title),
      created_by: staff.id,
    });
    if (error) return { error: error.message };
  }
  revalidateSite();
  return { ok: true };
}

export async function deleteArticleAction(id: string) {
  await requireStaff();
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "Supabase 未配置" };
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateSite();
  return { ok: true };
}

export async function signGuestbookAction(formData: FormData) {
  const nickname = String(formData.get("nickname") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (nickname.length < 1 || nickname.length > 24) {
    return { error: "昵称请写 1～24 个字" };
  }
  if (body.length < 1 || body.length > 500) {
    return { error: "留言请写 1～500 个字" };
  }
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "还没接上数据库，留言暂时寄不出去。" };
  const { error } = await supabase.from("comments").insert({
    nickname,
    body,
    parent_id: null,
    created_by: null,
  });
  if (error) return { error: "留言失败，稍后再试。" };
  revalidatePath("/guestbook");
  revalidatePath("/home");
  return { ok: true };
}

export async function replyGuestbookAction(formData: FormData) {
  const staff = await requireStaff();
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "Supabase 未配置" };
  const parent_id = String(formData.get("parent_id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!parent_id || !body) return { error: "回复不能空" };
  const { error } = await supabase.from("comments").insert({
    parent_id,
    nickname: staff.display_name || "tteok",
    body,
    created_by: staff.id,
  });
  if (error) return { error: error.message };
  revalidateSite();
  return { ok: true };
}

export async function hideGuestbookAction(id: string, isHidden: boolean) {
  await requireStaff();
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "Supabase 未配置" };
  const { error } = await supabase
    .from("comments")
    .update({ is_hidden: isHidden })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidateSite();
  return { ok: true };
}

export async function saveTrackAction(formData: FormData) {
  await requireStaff();
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "Supabase 未配置" };
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const external_url = String(formData.get("external_url") ?? "").trim();
  const sort_order = Number(formData.get("sort_order") ?? 0);
  const is_active = formData.get("is_active") === "on";
  if (!title || !external_url) return { error: "歌名和外链都要填" };
  if (id) {
    const { error } = await supabase
      .from("music")
      .update({ title, url: external_url, sort_order, is_active })
      .eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("music").insert({
      title,
      url: external_url,
      sort_order,
      is_active,
    });
    if (error) return { error: error.message };
  }
  revalidateSite();
  return { ok: true };
}

export async function deleteTrackAction(id: string) {
  await requireStaff();
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "Supabase 未配置" };
  const { error } = await supabase.from("music").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateSite();
  return { ok: true };
}

function emptyToNull(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}
