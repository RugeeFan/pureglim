import { NextResponse } from "next/server";
import { getSessionFromRequest } from "./lib/auth/session";
import { getReferrerSessionFromRequest } from "./lib/auth/referrerSession";

export default async function proxy(request) {
  try {
    const { pathname } = request.nextUrl;
    const session = await getSessionFromRequest(request);
    const referrerSession = await getReferrerSessionFromRequest(request);

    if (pathname.startsWith("/admin")) {
      if (pathname === "/admin/login") {
        if (session.valid) {
          return NextResponse.redirect(new URL("/admin/enquiries", request.url));
        }
        return NextResponse.next();
      }

      if (!session.valid) {
        const url = new URL("/admin/login", request.url);
        url.searchParams.set("from", pathname);
        return NextResponse.redirect(url);
      }
    }

    // Backward compat: /partner/* → /referral/*
    if (pathname.startsWith("/partner")) {
      return NextResponse.redirect(
        new URL(pathname.replace("/partner", "/referral"), request.url),
      );
    }

    if (pathname.startsWith("/referral")) {
      if (["/referral/login", "/referral/register", "/referral/verify"].includes(pathname)) {
        if (referrerSession.valid) {
          return NextResponse.redirect(new URL("/referral/dashboard", request.url));
        }
        return NextResponse.next();
      }

      if (!referrerSession.valid) {
        const url = new URL("/referral/login", request.url);
        url.searchParams.set("from", pathname);
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  } catch (err) {
    console.error("[middleware] auth error:", err.message);
    if (request.nextUrl.pathname.startsWith("/partner")) {
      return NextResponse.redirect(
        new URL(
          request.nextUrl.pathname.replace("/partner", "/referral"),
          request.url,
        ),
      );
    }
    if (request.nextUrl.pathname.startsWith("/referral")) {
      if (!["/referral/login", "/referral/register", "/referral/verify"].includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/referral/login", request.url));
      }
      return NextResponse.next();
    }
    if (request.nextUrl.pathname !== "/admin/login") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin/:path*", "/partner/:path*", "/referral/:path*"],
};
