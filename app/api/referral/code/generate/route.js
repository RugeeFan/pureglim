import { NextResponse } from "next/server";
import { getReferrerSessionFromRequest } from "../../../../../lib/auth/referrerSession";
import { ensureReferrerReferralCode } from "../../../../../lib/services/referrers";

export async function POST(request) {
  try {
    const session = await getReferrerSessionFromRequest(request);
    if (!session.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const code = await ensureReferrerReferralCode(session.payload.sub);
    return NextResponse.json({ success: true, code });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "We couldn't generate your code right now.",
      },
      { status: 500 },
    );
  }
}
