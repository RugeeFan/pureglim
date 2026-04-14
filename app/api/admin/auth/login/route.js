import { NextResponse } from "next/server";
import { signJwt, COOKIE_NAME } from "../../../../../lib/auth/session";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body ?? {};

    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (
      !validUsername ||
      !validPassword ||
      username !== validUsername ||
      password !== validPassword
    ) {
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
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
