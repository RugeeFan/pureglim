import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "../../../../lib/auth/session";
import { deleteAllQuoteRequests } from "../../../../lib/services/quoteRequests";

export async function DELETE() {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore);
  if (!session.valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await deleteAllQuoteRequests();
    return NextResponse.json({ success: true, count: result.count });
  } catch {
    return NextResponse.json({ error: "Failed to delete enquiries." }, { status: 500 });
  }
}
