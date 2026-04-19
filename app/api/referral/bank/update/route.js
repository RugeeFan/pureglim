import { NextResponse } from "next/server";
import { getReferrerSessionFromRequest } from "../../../../../lib/auth/referrerSession";
import { normalizeBsb, updateReferrerBankDetails } from "../../../../../lib/services/referrers";
import { referrerBankDetailsSchema } from "../../../../../lib/validation/referrerAuth";

export async function PUT(request) {
  try {
    const session = await getReferrerSessionFromRequest(request);
    if (!session.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const bsb = normalizeBsb(parsed.data.bsb);
    if (!bsb) {
      return NextResponse.json(
        { error: "Please enter a valid BSB (e.g. 062-000)." },
        { status: 400 },
      );
    }

    await updateReferrerBankDetails(session.payload.sub, {
      bankAccountName: parsed.data.bankAccountName,
      bsb,
      bankAccountNumber: parsed.data.bankAccountNumber,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "We couldn't save your bank details right now.",
      },
      { status: 500 },
    );
  }
}
