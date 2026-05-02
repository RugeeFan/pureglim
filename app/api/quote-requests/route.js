import { NextResponse } from "next/server";
import { sendQuoteRequestNotification } from "../../../lib/mail/sendQuoteRequestNotification";
import { sendCustomerConfirmation } from "../../../lib/mail/sendCustomerConfirmation";
import {
  buildQuoteRequestReference,
  createQuoteRequest,
} from "../../../lib/services/quoteRequests";
import { quoteRequestSchema } from "../../../lib/validation/quoteRequest";

export async function POST(request) {
  try {
    const json = await request.json();
    const parsed = quoteRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please check the form fields and try again.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const result = await createQuoteRequest(parsed.data);

    if (result.duplicate) {
      // Same phone has an active booking in the last 14 days. Don't insert
      // a second row, don't re-send emails — just tell the customer we
      // already have their request and someone will be in touch.
      return NextResponse.json({
        success: true,
        duplicate: true,
        id: result.existingId,
        referenceId: buildQuoteRequestReference(result.existingId),
        message:
          "We've already received a booking from this number. We'll contact you within 24 hours.",
      });
    }

    const createdRequest = result.booking;
    const referenceId = buildQuoteRequestReference(createdRequest.id);

    try {
      await Promise.all([
        sendQuoteRequestNotification(createdRequest),
        sendCustomerConfirmation(createdRequest),
      ]);
    } catch (error) {
      console.error("[email] send failed:", error);

      return NextResponse.json(
        {
          error:
            "Your request was saved, but we couldn't send the email notification just now. Please contact us directly and mention your reference number.",
          saved: true,
          id: createdRequest.id,
          referenceId,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      id: createdRequest.id,
      referenceId,
    });
  } catch (error) {
    console.error("[quote-requests] Unexpected error:", error);
    return NextResponse.json(
      { error: "Something went wrong while saving your request." },
      { status: 500 },
    );
  }
}
