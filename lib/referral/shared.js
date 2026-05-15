export const REFERRAL_QUERY_PARAM = "ref";
export const REFERRAL_STORAGE_KEY = "pureglim-referral-attribution";
export const REFERRAL_COOKIE_KEY = "pureglim_referral_code";
export const REFERRAL_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export function normalizeReferralCode(input) {
  return input?.trim().toUpperCase().replace(/\s+/g, "") || "";
}

export function isReferralDiscountEligibleService(serviceType) {
  return (
    serviceType === "regular" ||
    serviceType === "end_of_lease" ||
    serviceType === "hourly"
  );
}

export function buildReferralPath(code) {
  const normalizedCode = normalizeReferralCode(code);
  if (!normalizedCode) return "/";
  return `/?${REFERRAL_QUERY_PARAM}=${encodeURIComponent(normalizedCode)}`;
}
