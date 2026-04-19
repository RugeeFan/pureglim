import { SignJWT, jwtVerify } from "jose";

export const REFERRER_COOKIE_NAME = "pg_referrer_token";
export const REFERRER_PENDING_COOKIE_NAME = "pg_referrer_pending";

function getSecret() {
  const s = process.env.PARTNER_JWT_SECRET;
  if (!s) throw new Error("PARTNER_JWT_SECRET environment variable is not set.");
  return new TextEncoder().encode(s);
}

export async function signReferrerJwt(referrer) {
  return new SignJWT({
    sub: referrer.id,
    phone: referrer.phone,
    role: "referrer",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(getSecret());
}

export async function signReferrerPendingJwt(payload) {
  return new SignJWT({
    ...payload,
    role: "referrer_pending",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(getSecret());
}

export async function verifyReferrerJwt(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    return { valid: true, payload };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Invalid token.",
    };
  }
}

export async function getReferrerSession(cookieStore) {
  const token = cookieStore.get(REFERRER_COOKIE_NAME)?.value;
  if (!token) return { valid: false };
  return verifyReferrerJwt(token);
}

export async function getReferrerSessionFromRequest(request) {
  const token = request.cookies.get(REFERRER_COOKIE_NAME)?.value;
  if (!token) return { valid: false };
  return verifyReferrerJwt(token);
}

export async function getReferrerPendingSessionFromRequest(request) {
  const token = request.cookies.get(REFERRER_PENDING_COOKIE_NAME)?.value;
  if (!token) return { valid: false };
  const result = await verifyReferrerJwt(token);
  if (result.valid && result.payload.role !== "referrer_pending") {
    return { valid: false, error: "Invalid session type." };
  }
  return result;
}
