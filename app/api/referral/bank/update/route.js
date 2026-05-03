import { NextResponse } from "next/server";
import { getReferrerSessionFromRequest } from "../../../../../lib/auth/referrerSession";
import { normalizeBsb, updateReferrerBankDetails } from "../../../../../lib/services/referrers";
import { referrerBankDetailsSchema } from "../../../../../lib/validation/referrerAuth";
import { reserveActionRateLimit } from "../../../../../lib/services/smsRateLimit";

export async function PUT(request) {
  try {
    const session = await getReferrerSessionFromRequest(request);
    if (!session.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limit = await reserveActionRateLimit("bank", session.payload.sub);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: `Please wait ${limit.secondsLeft}s before trying again.` },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = referrerBankDetailsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please check your bank details and try again.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    if (parsed.data.paymentMethod === "bsb") {
      const bsb = normalizeBsb(parsed.data.bsb);
      if (!bsb) {
        return NextResponse.json(
          { error: "Please enter a valid BSB (e.g. 062-000)." },
          { status: 400 },
        );
      }
      await updateReferrerBankDetails(session.payload.sub, {
        paymentMethod: "bsb",
        bankAccountName: parsed.data.bankAccountName,
        bsb,
        bankAccountNumber: parsed.data.bankAccountNumber,
      });
    } else {
      await updateReferrerBankDetails(session.payload.sub, {
        paymentMethod: "payid",
        bankAccountName: parsed.data.bankAccountName,
        payId: parsed.data.payId,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[referral/bank/update] Unexpected error:", error);
    return NextResponse.json(
      { error: "We couldn't save your bank details right now." },
      { status: 500 },
    );
  }
}
