import { NextResponse } from "next/server";
import {
  REFERRER_COOKIE_NAME,
  REFERRER_PENDING_COOKIE_NAME,
  getReferrerPendingSessionFromRequest,
  signReferrerJwt,
  signReferrerPendingJwt,
} from "../../../../../lib/auth/referrerSession";

const MAX_OTP_ATTEMPTS = 5;
import {
  findOrCreateVerifiedReferrer,
  ReferrerRegistrationConflictError,
} from "../../../../../lib/services/referrers";
import { verifyPhoneCode } from "../../../../../lib/services/twilioVerify";
import { referrerAuthVerifySchema } from "../../../../../lib/validation/referrerAuth";

import { buildAuthCookieOptions as buildCookieOptions, REFERRER_SESSION_MAX_AGE } from "../../../../../lib/auth/cookies";

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = referrerAuthVerifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please enter the verification code.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const pending = await getReferrerPendingSessionFromRequest(request);
    if (!pending.valid) {
      return NextResponse.json(
        { error: "Your verification session has expired. Please start again." },
        { status: 401 },
      );
    }

    const currentAttempts = Number(pending.payload.attempts ?? 0);
    if (currentAttempts >= MAX_OTP_ATTEMPTS) {
      const response = NextResponse.json(
        { error: "Too many incorrect attempts. Please start again." },
        { status: 401 },
      );
      response.cookies.set(REFERRER_PENDING_COOKIE_NAME, "", buildCookieOptions(0));
      return response;
    }

    // If /start signed `consistent: false` (mode/account-state mismatch),
    // skip Twilio entirely and treat as a wrong code — preserves the
    // exact same response shape as a legit bad-OTP attempt.
    const verification = pending.payload.consistent === false
      ? { approved: false, status: "rejected", mock: false }
      : await verifyPhoneCode(pending.payload.phone, parsed.data.code);

    if (!verification.approved) {
      const newAttempts = currentAttempts + 1;
      const remaining = MAX_OTP_ATTEMPTS - newAttempts;

      if (remaining <= 0) {
        const response = NextResponse.json(
          { error: "Too many incorrect attempts. Please start again." },
          { status: 401 },
        );
        response.cookies.set(REFERRER_PENDING_COOKIE_NAME, "", buildCookieOptions(0));
        return response;
      }

      const newPendingPayload = {
        phone: pending.payload.phone,
        fullName: pending.payload.fullName,
        mode: pending.payload.mode,
        ...(pending.payload.passwordHash
          ? { passwordHash: pending.payload.passwordHash }
          : {}),
        ...(pending.payload.consistent === false
          ? { consistent: false }
          : {}),
        attempts: newAttempts,
      };
      const newToken = await signReferrerPendingJwt(newPendingPayload);

      const response = NextResponse.json(
        {
          error: `That verification code wasn't accepted. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
          attemptsRemaining: remaining,
        },
        { status: 400 },
      );
      response.cookies.set(
        REFERRER_PENDING_COOKIE_NAME,
        newToken,
        buildCookieOptions(60 * 10),
      );
      return response;
    }

    const referrer = await findOrCreateVerifiedReferrer({
      fullName: pending.payload.fullName,
      phone: pending.payload.phone,
      mode: pending.payload.mode,
      passwordHash: pending.payload.passwordHash,
    });
    const sessionToken = await signReferrerJwt(referrer);

    const response = NextResponse.json({
      success: true,
      referrer: {
        id: referrer.id,
        fullName: referrer.fullName,
        phone: referrer.phone,
        referralCode: referrer.referralCode,
      },
    });

    response.cookies.set(
      REFERRER_COOKIE_NAME,
      sessionToken,
      buildCookieOptions(REFERRER_SESSION_MAX_AGE),
    );
    response.cookies.set(REFERRER_PENDING_COOKIE_NAME, "", buildCookieOptions(0));

    return response;
  } catch (error) {
    if (error instanceof ReferrerRegistrationConflictError) {
      const response = NextResponse.json(
        { error: error.message },
        { status: 409 },
      );
      response.cookies.set(REFERRER_PENDING_COOKIE_NAME, "", buildCookieOptions(0));
      return response;
    }
    console.error("[referral/verify] Unexpected error:", error);
    return NextResponse.json(
      { error: "We couldn't verify the code right now." },
      { status: 500 },
    );
  }
}
