import {
  REFERRAL_COOKIE_KEY,
  REFERRAL_COOKIE_MAX_AGE,
  REFERRAL_STORAGE_KEY,
  normalizeReferralCode,
} from "./shared";

function isBrowser() {
  return typeof window !== "undefined";
}

function readCookieValue(name) {
  if (!isBrowser()) return "";
  const cookies = document.cookie ? document.cookie.split("; ") : [];
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  if (!match) return "";
  return decodeURIComponent(match.slice(name.length + 1));
}

function writeCookie(name, value, maxAge) {
  if (!isBrowser()) return;
  const securePart = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${securePart}`;
}

export function persistReferralAttribution({ code, referrerName = "" }) {
  if (!isBrowser()) return;

  const normalizedCode = normalizeReferralCode(code);
  if (!normalizedCode) {
    clearReferralAttribution();
    return;
  }

  const payload = {
    code: normalizedCode,
    referrerName: referrerName?.trim() || "",
    savedAt: Date.now(),
  };

  window.localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(payload));
  writeCookie(REFERRAL_COOKIE_KEY, normalizedCode, REFERRAL_COOKIE_MAX_AGE);
}

export function readReferralAttribution() {
  if (!isBrowser()) return null;

  const rawStoredValue = window.localStorage.getItem(REFERRAL_STORAGE_KEY);
  if (rawStoredValue) {
    try {
      const parsed = JSON.parse(rawStoredValue);
      const normalizedCode = normalizeReferralCode(parsed?.code);
      if (normalizedCode) {
        return {
          code: normalizedCode,
          referrerName: parsed?.referrerName?.trim() || "",
        };
      }
    } catch {
      window.localStorage.removeItem(REFERRAL_STORAGE_KEY);
    }
  }

  const cookieCode = normalizeReferralCode(readCookieValue(REFERRAL_COOKIE_KEY));
  if (!cookieCode) return null;

  return {
    code: cookieCode,
    referrerName: "",
  };
}

export function clearReferralAttribution() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(REFERRAL_STORAGE_KEY);
  writeCookie(REFERRAL_COOKIE_KEY, "", 0);
}
