// Shared cookie options for HttpOnly auth/session cookies. Previously every
// referral auth route declared its own buildCookieOptions copy, which made
// it easy for one route to drift on `secure` or `sameSite` and silently
// weaken the cookie surface. Centralised here so all callers stay aligned.

export function buildAuthCookieOptions(maxAgeSeconds) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
