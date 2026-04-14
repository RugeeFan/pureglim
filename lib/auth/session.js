import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME = "pg_admin_token";

function getSecret() {
  const s = process.env.ADMIN_JWT_SECRET;
  if (!s) throw new Error("ADMIN_JWT_SECRET environment variable is not set.");
  return new TextEncoder().encode(s);
}

export async function signJwt() {
  return new SignJWT({ sub: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecret());
}

// Returns { valid: true, payload } or { valid: false, error }
export async function verifyJwt(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    return { valid: true, payload };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

// For server components — pass the cookieStore from `await cookies()`
export async function getSession(cookieStore) {
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return { valid: false };
  return verifyJwt(token);
}

// For middleware / route handlers — pass the Request or NextRequest object
export async function getSessionFromRequest(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return { valid: false };
  return verifyJwt(token);
}
