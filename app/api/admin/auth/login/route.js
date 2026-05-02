import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { signJwt, COOKIE_NAME } from "../../../../../lib/auth/session";
import { verifyAdminPassword } from "../../../../../lib/auth/adminPassword";
import {
  checkLoginAttempt,
  clearLoginAttempts,
  recordLoginFailure,
} from "../../../../../lib/services/loginAttempts";
import { getClientIp } from "../../../../../lib/utils/clientIp";

function timingSafeStringEqual(a, b) {
  const aBuf = Buffer.from(String(a ?? ""), "utf8");
  const bBuf = Buffer.from(String(b ?? ""), "utf8");
  if (aBuf.length !== bBuf.length) {
    const placeholder = Buffer.alloc(aBuf.length || 1);
    timingSafeEqual(aBuf.length ? aBuf : Buffer.alloc(1), placeholder);
    return false;
  }
  return timingSafeEqual(aBuf, bBuf);
}

function buildAttemptKey(ip) {
  // Single admin account → keying by IP is the meaningful axis. Unknown IP
  // (no x-forwarded-for) falls into a single bucket; this is intentional —
  // it slows a misconfigured-proxy attacker without locking out everyone.
  return `admin-login:${ip ?? "unknown"}`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body ?? {};
    const passwordStr = typeof password === "string" ? password : "";

    const clientIp = getClientIp(request);
    const attemptKey = buildAttemptKey(clientIp);

    const lock = await checkLoginAttempt(attemptKey);
    if (lock.locked) {
      return NextResponse.json(
        {
          error: "Too many failed login attempts. Please try again later.",
          secondsLeft: lock.secondsLeft,
        },
        { status: 429 },
      );
    }

    const validUsername = process.env.ADMIN_USERNAME;
    if (!validUsername) {
      console.error("[admin/auth/login] ADMIN_USERNAME is not set");
      // Still run a dummy verify to equalize timing with the legit path.
      await verifyAdminPassword(passwordStr);
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 },
      );
    }

    const usernameOk = timingSafeStringEqual(username, validUsername);
    const passwordOk = await verifyAdminPassword(passwordStr);

    if (!usernameOk || !passwordOk) {
      const result = await recordLoginFailure(attemptKey);
      if (result.locked) {
        return NextResponse.json(
          {
            error: "Too many failed login attempts. Please try again later.",
            secondsLeft: Math.ceil((result.lockedUntil.getTime() - Date.now()) / 1000),
          },
          { status: 429 },
        );
      }
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 },
      );
    }

    await clearLoginAttempts(attemptKey);

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
  } catch (error) {
    console.error("[admin/auth/login] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
