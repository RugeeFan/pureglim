import { NextResponse } from "next/server";
import { getReferrerSessionFromRequest } from "../../../../../lib/auth/referrerSession";
import { ensureReferrerReferralCode } from "../../../../../lib/services/referrers";
import { reserveActionRateLimit } from "../../../../../lib/services/smsRateLimit";

export async function POST(request) {
  try {
    const session = await getReferrerSessionFromRequest(request);
    if (!session.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limit = await reserveActionRateLimit("gen", session.payload.sub);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: `Please wait ${limit.secondsLeft}s before trying again.` },
        { status: 429 },
      );
    }

    const code = await ensureReferrerReferralCode(session.payload.sub);
    return NextResponse.json({ success: true, code });
  } catch (error) {
    console.error("[referral/code/generate] Unexpected error:", error);
    return NextResponse.json(
      { error: "We couldn't generate your code right now." },
      { status: 500 },
    );
  }
}
