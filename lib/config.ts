export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export const STORAGE_BUCKETS = {
  avatars: "avatars",
  photos: "photos",
  momentImages: "moment-images",
  articleCovers: "article-covers",
} as const;
