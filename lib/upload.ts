"use client";

import { createBrowserSupabase } from "@/lib/supabase/client";

export async function uploadToBucket(bucket: string, file: File) {
  const supabase = createBrowserSupabase();
  const safe = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `${Date.now()}-${safe}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}
