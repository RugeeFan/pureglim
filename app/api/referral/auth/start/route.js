import { NextResponse } from "next/server";
import { signReferrerPendingJwt, REFERRER_PENDING_COOKIE_NAME } from "../../../../../lib/auth/referrerSession";
import { getReferrerByPhone, normalizePhoneNumber } from "../../../../../lib/services/referrers";
import {
  reserveSmsRateLimit,
  reserveIpSmsAttempt,
  rollbackSmsRateLimitReservation,
} from "../../../../../lib/services/smsRateLimit";
import { startPhoneVerification } from "../../../../../lib/services/twilioVerify";
import { hashPassword } from "../../../../../lib/utils/password";
import { getClientIp } from "../../../../../lib/utils/clientIp";
import { referrerAuthStartSchema } from "../../../../../lib/validation/referrerAuth";
import {
  buildAuthCookieOptions as buildCookieOptions,
  REFERRER_PENDING_SESSION_MAX_AGE,
} from "../../../../../lib/auth/cookies";

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = referrerAuthStartSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please check your details and try again.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
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
    const ipLimit = await reserveIpSmsAttempt(clientIp);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many requests. Please wait ${ipLimit.secondsLeft}s before trying again.`,
          secondsLeft: ipLimit.secondsLeft,
        },
        { status: 429 },
      );
    }

    if (parsed.data.mode === "register" && !parsed.data.password) {
      return NextResponse.json(
        { error: "A password is required to register." },
        { status: 400 },
      );
    }

    // Existence-check is intentionally NOT used to branch the response —
    // 409/404 differentiation here would let an attacker enumerate registered
    // phone numbers without ever owning the SIM. We sign a "consistent" flag
    // into the pending JWT and the verify route enforces it after OTP.
    // For mode "upsert" the operation always succeeds regardless of account
    // existence, so consistent is always true and we always send a real SMS.
    const existingReferrer = parsed.data.mode !== "upsert"
      ? await getReferrerByPhone(phone)
      : null;
    const consistent =
      parsed.data.mode === "upsert" ||
      (parsed.data.mode === "register" && !existingReferrer) ||
      (parsed.data.mode === "login" && Boolean(existingReferrer));

    const rateLimit = await reserveSmsRateLimit(phone);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Please wait ${rateLimit.secondsLeft}s before requesting another code.`, secondsLeft: rateLimit.secondsLeft },
        { status: 429 },
      );
    }

    const passwordHash = parsed.data.mode === "register" && parsed.data.password
      ? await hashPassword(parsed.data.password)
      : undefined;

    // Only burn a real SMS when the (mode, account-state) tuple is consistent.
    // For mismatched tuples we still set a pending cookie of identical shape so
    // the response is indistinguishable to an attacker. The verify route fails
    // these closed using the same generic "incorrect code" path.
    let verification = { mock: false };
    if (consistent) {
      try {
        verification = await startPhoneVerification(phone);
      } catch (error) {
        await rollbackSmsRateLimitReservation(rateLimit.reservation);
        throw error;
      }
    }

    const pendingToken = await signReferrerPendingJwt({
      phone,
      fullName: parsed.data.fullName,
      mode: parsed.data.mode,
      ...(passwordHash ? { passwordHash } : {}),
      ...(consistent ? {} : { consistent: false }),
    });

    const response = NextResponse.json({
      success: true,
      phone,
      mock: Boolean(verification.mock),
      ...(verification.mock && process.env.NODE_ENV === "development"
        ? { devCode: verification.devCode }
        : {}),
    });

    response.cookies.set(
      REFERRER_PENDING_COOKIE_NAME,
      pendingToken,
      buildCookieOptions(REFERRER_PENDING_SESSION_MAX_AGE),
    );

    return response;
  } catch (error) {
    console.error("[referral/auth/start] Unexpected error:", error);
    return NextResponse.json(
      { error: "We couldn't start verification right now." },
      { status: 500 },
    );
  }
}
