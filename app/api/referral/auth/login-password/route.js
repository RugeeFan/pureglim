import { NextResponse } from "next/server";
import { signReferrerJwt, REFERRER_COOKIE_NAME } from "../../../../../lib/auth/referrerSession";
import { getReferrerByPhone, normalizePhoneNumber, touchReferrerLogin } from "../../../../../lib/services/referrers";
import { verifyPassword } from "../../../../../lib/utils/password";
import {
  checkLoginAttempt,
  clearLoginAttempts,
  recordLoginFailure,
} from "../../../../../lib/services/loginAttempts";
import { getClientIp } from "../../../../../lib/utils/clientIp";
import { referrerAuthPasswordLoginSchema } from "../../../../../lib/validation/referrerAuth";

import { buildAuthCookieOptions as buildCookieOptions } from "../../../../../lib/auth/cookies";

// Precomputed scrypt of "login-password-timing-equalizer" — hardcoded so the
// "no user" / "user has no password" paths run scrypt against this hash and
// produce the same response time as a real "user exists, wrong password"
// call. Computing the dummy on demand would leak ~70ms on the first request
// after server boot.
const DUMMY_PASSWORD_HASH = "c720520ee5f94b4881e4d5dccc12d0bed018f79d5065e449d8d9dfb62d370ce43a3fc6f77dafe211e597baed59b3f9392ed9c9686275dea39d67b9b740e4351d:login-password-timing-equalizer-salt";

function buildAttemptKey(phone, ip) {
  // phone is the normalized E.164 +614xxxxxxxx; ip may be null when behind a
  // proxy that strips x-forwarded-for. We always include phone so that an
  // unknown-IP failure still counts toward the per-account threshold.
  return `referral-login:${phone}:${ip ?? "unknown"}`;
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

    const clientIp = getClientIp(request);
    const attemptKey = buildAttemptKey(phone, clientIp);

    const lock = await checkLoginAttempt(attemptKey);
    if (lock.locked) {
      return NextResponse.json(
        {
          error: "Too many failed login attempts. Please try again later.",
          secondsLeft: lock.secondsLeft,
        },
        { status: 429 },
      );
    }

    const referrer = await getReferrerByPhone(phone);
    const hashToCheck = referrer?.passwordHash ?? DUMMY_PASSWORD_HASH;
    const valid = await verifyPassword(parsed.data.password, hashToCheck);

    if (!referrer || !referrer.passwordHash || !valid) {
      const result = await recordLoginFailure(attemptKey);
      if (result.locked) {
        return NextResponse.json(
          {
            error: "Too many failed login attempts. Please try again later.",
            secondsLeft: Math.ceil((result.lockedUntil.getTime() - Date.now()) / 1000),
          },
          { status: 429 },
        );
      }
      return NextResponse.json(
        { error: "Incorrect phone number or password." },
        { status: 401 },
      );
    }

    await clearLoginAttempts(attemptKey);
    await touchReferrerLogin(referrer.id);
    const token = await signReferrerJwt(referrer);

    const response = NextResponse.json({ success: true });
    response.cookies.set(REFERRER_COOKIE_NAME, token, buildCookieOptions(60 * 60 * 24 * 14));
    return response;
  } catch (error) {
    console.error("[referral/auth/login-password] Unexpected error:", error);
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 },
    );
  }
}
