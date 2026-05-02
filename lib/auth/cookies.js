// Shared cookie options for HttpOnly auth/session cookies. Previously every
// referral auth route declared its own buildCookieOptions copy, which made
// it easy for one route to drift on `secure` or `sameSite` and silently
// weaken the cookie surface. Centralised here so all callers stay aligned.

export const REFERRER_SESSION_MAX_AGE = 60 * 60 * 24 * 14; // 14 days
export const REFERRER_PENDING_SESSION_MAX_AGE = 60 * 10; // 10 minutes

export function buildAuthCookieOptions(maxAgeSeconds) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
