import { NextResponse } from "next/server";
import { getSessionFromRequest } from "../../../../../lib/auth/session";
import { verifyAdminPassword, setAdminPassword } from "../../../../../lib/auth/adminPassword";

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

    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body ?? {};

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "New passwords do not match." }, { status: 400 });
    }

    const currentOk = await verifyAdminPassword(currentPassword);
    if (!currentOk) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }

    await setAdminPassword(newPassword);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
