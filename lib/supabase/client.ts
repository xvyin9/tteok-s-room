import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "@/lib/config";

export function createBrowserSupabase() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase 还没配置");
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
