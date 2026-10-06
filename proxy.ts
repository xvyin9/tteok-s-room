import { updateSession } from "@/lib/supabase/session";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
