import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
const KEYLEN = 64;

export async function hashPassword(plain) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(plain, salt, KEYLEN);
  return `${buf.toString("hex")}:${salt}`;
}

export async function verifyPassword(plain, stored) {
  const [hash, salt] = stored.split(":");
  const buf = await scryptAsync(plain, salt, KEYLEN);
  const storedBuf = Buffer.from(hash, "hex");
  return buf.length === storedBuf.length && timingSafeEqual(buf, storedBuf);
}
