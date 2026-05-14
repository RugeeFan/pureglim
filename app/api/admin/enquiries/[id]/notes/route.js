import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { getSession } from "../../../../../../lib/auth/session";
import { updateInternalNotes } from "../../../../../../lib/services/quoteRequests";

// Cap server-side at 4000 chars. Admin notes are short follow-up reminders,
// not freeform documents; this is well over any realistic use and bounds the
// payload size if a stale tab tries to dump huge content into the column.
const bodySchema = z.object({
  notes: z.string().max(4000).optional().default(""),
});

export async function PATCH(request, context) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore);
  if (!session.valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Missing enquiry id." }, { status: 400 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Notes must be a string of 4000 characters or fewer." },
      { status: 400 },
    );
  }

  try {
    const result = await updateInternalNotes(id, parsed.data.notes);
    return NextResponse.json({
      success: true,
      changed: result.changed,
      internalNotesUpdatedAt: result.updated.internalNotesUpdatedAt ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save notes.";
    const status = message === "Booking not found." ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
