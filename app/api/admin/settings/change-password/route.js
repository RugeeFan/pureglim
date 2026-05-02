import { NextResponse } from "next/server";
import { getSessionFromRequest } from "../../../../../lib/auth/session";
import { verifyAdminPassword, setAdminPassword } from "../../../../../lib/auth/adminPassword";
import { adminPasswordChangeSchema } from "../../../../../lib/validation/referrerAuth";

function sameOrigin(request) {
  // Defense-in-depth on top of SameSite=Lax cookie. Modern browsers don't
  // send Lax cookies on cross-site POST, but a mis-flagged cookie or a
  // future SameSite relaxation would re-open the door. Origin/Referer
  // validation closes that gap explicitly for the destructive endpoint.
  const origin = request.headers.get("origin") || request.headers.get("referer") || "";
  if (!origin) return false;
  let originHost;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  const expectedHost = request.headers.get("host") || "";
  return originHost === expectedHost;
}

export async function POST(request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session.valid) {
      return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
    }

    if (!sameOrigin(request)) {
      return NextResponse.json({ error: "Unauthorised." }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    const parsed = adminPasswordChangeSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || "Invalid request.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { currentPassword, newPassword } = parsed.data;

    const currentOk = await verifyAdminPassword(currentPassword);
    if (!currentOk) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }

    await setAdminPassword(newPassword);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin/settings/change-password] Unexpected error:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
