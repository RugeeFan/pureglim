import { NextResponse } from "next/server";
import { getSessionFromRequest } from "../../../../../lib/auth/session";
import { verifyAdminPassword, setAdminPassword } from "../../../../../lib/auth/adminPassword";

export async function POST(request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session.valid) {
      return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
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
