import { NextResponse } from "next/server";
import { getSessionFromRequest } from "./lib/auth/session";

export async function proxy(request) {
  try {
    const { pathname } = request.nextUrl;
    const session = await getSessionFromRequest(request);

    // Already-authenticated users hitting /admin/login → redirect to enquiries
    if (pathname === "/admin/login") {
      if (session.valid) {
        return NextResponse.redirect(new URL("/admin/enquiries", request.url));
      }
      return NextResponse.next();
    }

    // All other /admin/** routes require auth
    if (!session.valid) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (err) {
    console.error("[middleware] auth error:", err.message);
    if (request.nextUrl.pathname !== "/admin/login") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
