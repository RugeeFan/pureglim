import { NextResponse } from "next/server";
import { getReferrerPendingSessionFromRequest } from "../../../../../lib/auth/referrerSession";
import {
  reserveSmsRateLimit,
  reserveIpSmsAttempt,
  rollbackSmsRateLimitReservation,
} from "../../../../../lib/services/smsRateLimit";
import { startPhoneVerification } from "../../../../../lib/services/twilioVerify";
import { getClientIp } from "../../../../../lib/utils/clientIp";

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

    // Atomic check-and-reserve. The previous (checkSmsRateLimit + setSmsRateLimit)
    // pattern allowed two concurrent requests to both pass the read and both
    // burn a Twilio SMS — one per phone per 60s is the contract.
    const rateLimit = await reserveSmsRateLimit(phone);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Please wait ${rateLimit.secondsLeft}s before requesting another code.`, secondsLeft: rateLimit.secondsLeft },
        { status: 429 },
      );
    }

    // Skip Twilio for inconsistent (mode, account-state) tuples — see /start.
    let verification = { mock: false };
    if (pending.payload.consistent !== false) {
      try {
        verification = await startPhoneVerification(phone);
      } catch (error) {
        await rollbackSmsRateLimitReservation(rateLimit.reservation);
        throw error;
      }
    }

    return NextResponse.json({
      success: true,
      mock: Boolean(verification.mock),
      ...(verification.mock && process.env.NODE_ENV === "development"
        ? { devCode: verification.devCode }
        : {}),
    });
  } catch (error) {
    console.error("[referral/auth/resend] Unexpected error:", error);
    return NextResponse.json(
      { error: "We couldn't resend the code right now." },
      { status: 500 },
    );
  }
}
