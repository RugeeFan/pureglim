import { NextResponse } from "next/server";
import { signReferrerJwt, REFERRER_COOKIE_NAME } from "../../../../../lib/auth/referrerSession";
import { getReferrerByPhone, normalizePhoneNumber, touchReferrerLogin } from "../../../../../lib/services/referrers";
import { verifyPassword } from "../../../../../lib/utils/password";
import { referrerAuthPasswordLoginSchema } from "../../../../../lib/validation/referrerAuth";

function buildCookieOptions(maxAgeSeconds) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = referrerAuthPasswordLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check your details and try again.", fieldErrors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const phone = normalizePhoneNumber(parsed.data.phone);
    if (!phone) {
      return NextResponse.json(
        { error: "Please enter a valid mobile phone number." },
        { status: 400 },
      );
    }

    const referrer = await getReferrerByPhone(phone);
    if (!referrer) {
      return NextResponse.json(
        { error: "Incorrect phone number or password." },
        { status: 401 },
      );
    }

    if (!referrer.passwordHash) {
      return NextResponse.json(
        { error: "This account doesn't have a password set. Please use SMS verification to log in." },
        { status: 400 },
      );
    }

    const valid = await verifyPassword(parsed.data.password, referrer.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Incorrect phone number or password." },
        { status: 401 },
      );
    }

    await touchReferrerLogin(referrer.id);
    const token = await signReferrerJwt(referrer);

    const response = NextResponse.json({ success: true });
    response.cookies.set(REFERRER_COOKIE_NAME, token, buildCookieOptions(60 * 60 * 24 * 14));
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Login failed. Please try again." },
      { status: 500 },
    );
  }
}
