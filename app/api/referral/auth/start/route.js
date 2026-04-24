import { NextResponse } from "next/server";
import { signReferrerPendingJwt, REFERRER_PENDING_COOKIE_NAME } from "../../../../../lib/auth/referrerSession";
import { getReferrerByPhone, normalizePhoneNumber } from "../../../../../lib/services/referrers";
import { checkSmsRateLimit, setSmsRateLimit } from "../../../../../lib/services/smsRateLimit";
import { startPhoneVerification } from "../../../../../lib/services/twilioVerify";
import { hashPassword } from "../../../../../lib/utils/password";
import { referrerAuthStartSchema } from "../../../../../lib/validation/referrerAuth";

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

    const rateLimit = await checkSmsRateLimit(phone);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Please wait ${rateLimit.secondsLeft}s before requesting another code.`, secondsLeft: rateLimit.secondsLeft },
        { status: 429 },
      );
    }

    const existingReferrer = await getReferrerByPhone(phone);

    if (parsed.data.mode === "register" && existingReferrer) {
      return NextResponse.json(
        { error: "That phone number already has a referral account. Please log in instead." },
        { status: 409 },
      );
    }

    if (parsed.data.mode === "login" && !existingReferrer) {
      return NextResponse.json(
        { error: "We couldn't find a referral account for that phone number. Please register first." },
        { status: 404 },
      );
    }

    if (parsed.data.mode === "register" && !parsed.data.password) {
      return NextResponse.json(
        { error: "A password is required to register." },
        { status: 400 },
      );
    }

    const passwordHash = parsed.data.mode === "register" && parsed.data.password
      ? await hashPassword(parsed.data.password)
      : undefined;

    const verification = await startPhoneVerification(phone);
    await setSmsRateLimit(phone);

    const pendingToken = await signReferrerPendingJwt({
      phone,
      fullName: parsed.data.fullName,
      mode: parsed.data.mode,
      ...(passwordHash ? { passwordHash } : {}),
    });

    const response = NextResponse.json({
      success: true,
      phone,
      mock: Boolean(verification.mock),
      ...(verification.mock && process.env.NODE_ENV !== "production"
        ? { devCode: verification.devCode }
        : {}),
    });

    response.cookies.set(
      REFERRER_PENDING_COOKIE_NAME,
      pendingToken,
      buildCookieOptions(60 * 10),
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "We couldn't start verification right now.",
      },
      { status: 500 },
    );
  }
}
