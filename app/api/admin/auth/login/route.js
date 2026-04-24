import { NextResponse } from "next/server";
import { signJwt, COOKIE_NAME } from "../../../../../lib/auth/session";
import { verifyAdminPassword } from "../../../../../lib/auth/adminPassword";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body ?? {};

    const validUsername = process.env.ADMIN_USERNAME;

    if (!validUsername || username !== validUsername) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 },
      );
    }

    const passwordOk = await verifyAdminPassword(password);
    if (!passwordOk) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 },
      );
    }

    const token = await signJwt();

    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
