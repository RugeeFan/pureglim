import { NextResponse } from "next/server";
import { buildReferralDiscountSummary, validateReferralCode } from "../../../../../lib/services/referrers";
import { referralCodeValidationSchema } from "../../../../../lib/validation/referrerAuth";

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = referralCodeValidationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          valid: false,
          error: "Please enter a valid referral code.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const match = await validateReferralCode(parsed.data.code);
    if (!match) {
      return NextResponse.json(
        {
          valid: false,
          error: "We couldn't find that referral code.",
        },
        { status: 404 },
      );
    }

    const summary = buildReferralDiscountSummary({
      code: match.normalizedCode,
      referrer: match.referrer,
      originalAmount: parsed.data.amount ?? null,
    });

    // Note: referrerName is intentionally NOT returned. Exposing it on this
    // unauthenticated endpoint would let an attacker enumerate all issued
    // referral codes against the small alphabet space and harvest the full
    // names (and previously phone-fallback) of every registered referrer.
    return NextResponse.json({
      valid: true,
      code: summary.code,
      discountAmount: summary.discountAmount,
      originalAmount: summary.originalAmount,
      finalAmount: summary.finalAmount,
    });
  } catch (error) {
    console.error("[referral/code/validate] Unexpected error:", error);
    return NextResponse.json(
      {
        valid: false,
        error: "We couldn't validate that code right now.",
      },
      { status: 500 },
    );
  }
}
