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

    // Public API surface is intentionally narrow:
    //   - referrerFirstName: first given name only (e.g. "Alice"). An attacker
    //     who scrapes /code/validate against the random-int code space gets
    //     a list of common given names — weak identifier, no surname or phone.
    //   - referrerName (full): NOT returned. Surname + phone fallback would
    //     let the same scraper rebuild full identities.
    return NextResponse.json({
      valid: true,
      code: summary.code,
      referrerFirstName: summary.referrerFirstName,
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
