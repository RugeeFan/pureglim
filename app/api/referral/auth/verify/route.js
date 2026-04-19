import { NextResponse } from "next/server";
import {
  REFERRER_COOKIE_NAME,
  REFERRER_PENDING_COOKIE_NAME,
  getReferrerPendingSessionFromRequest,
  signReferrerJwt,
} from "../../../../../lib/auth/referrerSession";
import { findOrCreateVerifiedReferrer } from "../../../../../lib/services/referrers";
import { verifyPhoneCode } from "../../../../../lib/services/twilioVerify";
import { referrerAuthVerifySchema } from "../../../../../lib/validation/referrerAuth";

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

    const verification = await verifyPhoneCode(
      pending.payload.phone,
      parsed.data.code,
    );

    if (!verification.approved) {
      return NextResponse.json(
        { error: "That verification code wasn't accepted. Please try again." },
        { status: 400 },
      );
    }

    const referrer = await findOrCreateVerifiedReferrer({
      fullName: pending.payload.fullName,
      phone: pending.payload.phone,
      mode: pending.payload.mode,
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
      buildCookieOptions(60 * 60 * 24 * 14),
    );
    response.cookies.set(REFERRER_PENDING_COOKIE_NAME, "", buildCookieOptions(0));

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "We couldn't verify the code right now.",
      },
      { status: 500 },
    );
  }
}
