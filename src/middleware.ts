import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "pams_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const needsSession =
    (pathname.startsWith("/admin") && pathname !== "/admin/login") ||
    pathname.startsWith("/preview");

  if (needsSession && !request.cookies.get(SESSION_COOKIE)?.value) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/preview/:path*"],
};
