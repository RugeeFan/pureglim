import { NextResponse } from "next/server";
import { getReferrerPendingSessionFromRequest } from "../../../../../lib/auth/referrerSession";
import { checkSmsRateLimit, setSmsRateLimit } from "../../../../../lib/services/smsRateLimit";
import { startPhoneVerification } from "../../../../../lib/services/twilioVerify";

export async function POST(request) {
  try {
    const pending = await getReferrerPendingSessionFromRequest(request);
    if (!pending.valid) {
      return NextResponse.json(
        { error: "Your session has expired. Please start again." },
        { status: 401 },
      );
    }

    const phone = pending.payload.phone;
    const rateLimit = await checkSmsRateLimit(phone);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Please wait ${rateLimit.secondsLeft}s before requesting another code.`, secondsLeft: rateLimit.secondsLeft },
        { status: 429 },
      );
    }

    const verification = await startPhoneVerification(phone);
    await setSmsRateLimit(phone);

    return NextResponse.json({
      success: true,
      mock: Boolean(verification.mock),
      ...(verification.mock && process.env.NODE_ENV !== "production"
        ? { devCode: verification.devCode }
        : {}),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "We couldn't resend the code right now." },
      { status: 500 },
    );
  }
}
