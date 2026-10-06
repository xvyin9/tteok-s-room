import { ownerCookie, ownerSecret, verifyOwnerToken } from "@/lib/owner-token";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ownerCookie)?.value ?? "";
  const signedIn = token ? await verifyOwnerToken(token, ownerSecret()) : false;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const dashboard = request.nextUrl.clone();
    dashboard.pathname = "/dashboard";
    dashboard.search = "";
    return NextResponse.redirect(dashboard);
  }

  if ((pathname === "/dashboard" || pathname.startsWith("/dashboard/")) && !signedIn) {
    const login = request.nextUrl.clone();
    login.pathname = "/login";
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (pathname === "/login" && signedIn) {
    const dashboard = request.nextUrl.clone();
    dashboard.pathname = "/dashboard";
    dashboard.search = "";
    return NextResponse.redirect(dashboard);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/login", "/admin", "/admin/:path*"],
};
