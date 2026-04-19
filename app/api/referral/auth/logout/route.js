import { NextResponse } from "next/server";
import { REFERRER_COOKIE_NAME, REFERRER_PENDING_COOKIE_NAME } from "../../../../../lib/auth/referrerSession";

function buildCookieOptions(maxAgeSeconds) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(REFERRER_COOKIE_NAME, "", buildCookieOptions(0));
  response.cookies.set(REFERRER_PENDING_COOKIE_NAME, "", buildCookieOptions(0));
  return response;
}
