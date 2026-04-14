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

    const createdRequest = await createQuoteRequest(parsed.data);
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
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while saving your request.",
      },
      { status: 500 },
    );
  }
}
