import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes (not /api, not public pages)
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Allow the login page (it's at /login, outside /admin)
  // Since matcher only catches /admin/*, login page is never blocked

  // Check for auth cookie
  const session = req.cookies.get("tmc_session")?.value;

  if (!session || session !== process.env.ADMIN_SESSION_SECRET) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
