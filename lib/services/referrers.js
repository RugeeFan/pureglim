import { randomInt } from "crypto";
import { Prisma } from "@prisma/client";
import prisma from "../prisma";
import {
  computeBookingAmounts,
  formatReferrerBookingStatusLabel,
  getCommissionStateLabel,
  isCommissionPaidStatus,
  isCommissionPendingStatus,
  isCompletedBookingStatus,
} from "./bookingMeta";
import { normalizeReferralCode } from "../referral/shared";

export class ReferrerRegistrationConflictError extends Error {
  constructor() {
    super("That phone number already has a referral account. Please log in instead.");
    this.code = "REFERRER_REGISTRATION_CONFLICT";
    this.name = "ReferrerRegistrationConflictError";
  }
}

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function codeFromName(fullName) {
  const first = (fullName || "")
    .trim()
    .split(/\s+/)[0]
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase()
    .slice(0, 7);
  return first.length >= 2 ? `PG${first}` : null;
}

function randomCode() {
  // crypto.randomInt is uniform and unpredictable.
  // Math.random was previously used here — fine for non-secret coupon codes
  // but combined with the (now-removed) phone-tail prefix it gave a guessable
  // sequence space; switch to CSPRNG to prevent enumeration of issued codes.
  let code = "PG";
  for (let i = 0; i < 6; i++) {
    code += CODE_ALPHABET[randomInt(0, CODE_ALPHABET.length)];
  }
  return code;
}

export function normalizeBsb(input) {
  const digits = (input || "").replace(/\D/g, "");
  if (digits.length !== 6) return null;
  return `${digits.slice(0, 3)}-${digits.slice(3)}`;
}

export function normalizePhoneNumber(input) {
  if (!input) return null;

  let value = input.trim().replace(/[^\d+]/g, "");
  if (value.startsWith("00")) {
    value = `+${value.slice(2)}`;
  }

  if (value.startsWith("0")) {
    value = `+61${value.slice(1)}`;
  } else if (!value.startsWith("+") && value.startsWith("61")) {
    value = `+${value}`;
  } else if (!value.startsWith("+") && /^4\d{8}$/.test(value)) {
    value = `+61${value}`;
  }

  // AU mobile only: +61 4 XXXX XXXX (12 chars total).
  // Rejects landlines (+613/+617/+618...), 1300/1800/1900, and all non-AU country codes.
  if (!/^\+614\d{8}$/.test(value)) {
    return null;
  }

  return value;
}

export async function getReferrerByPhone(phone) {
  return prisma.referrer.findUnique({ where: { phone } });
}

export async function getReferrerById(id) {
  return prisma.referrer.findUnique({ where: { id } });
}

export async function getReferrerByReferralCode(code) {
  if (!code) return null;
  return prisma.referrer.findFirst({
    where: {
      referralCode: normalizeReferralCode(code),
      isActive: true,
    },
  });
}

export async function createReferrerAccount({ fullName, phone, passwordHash }) {
  return prisma.referrer.create({
    data: {
      fullName: fullName?.trim() || null,
      phone,
      passwordHash: passwordHash ?? null,
      lastLoginAt: new Date(),
    },
  });
}

export async function touchReferrerLogin(id) {
  return prisma.referrer.update({
    where: { id },
    data: { lastLoginAt: new Date() },
  });
}

export async function findOrCreateVerifiedReferrer({ fullName, phone, mode, passwordHash }) {
  const existing = await getReferrerByPhone(phone);

  if (mode === "register") {
    if (existing) {
      throw new ReferrerRegistrationConflictError();
    }

    try {
      return await createReferrerAccount({ fullName, phone, passwordHash });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ReferrerRegistrationConflictError();
      }
      throw error;
    }
  }

  if (!existing) {
    throw new Error("We couldn't find a referral account for that phone number.");
  }

  return touchReferrerLogin(existing.id);
}

export async function ensureReferrerReferralCode(referrerId) {
  const existing = await prisma.referrer.findUnique({
    where: { id: referrerId },
    select: { referralCode: true, fullName: true, phone: true },
  });

  if (!existing) {
    throw new Error("Referral account not found.");
  }

  if (existing.referralCode) {
    return existing.referralCode;
  }

  // Candidate strategy:
  //   1. Name only:        PGSMITH
  //   2. Name + 1 letter:  PGSMITHA, PGSMITHB, ... PGSMITHZ
  //   3. Random fallback:  PGXY7K2J  (CSPRNG, 26 attempts)
  // Phone-tail digits were intentionally REMOVED — they leaked the last 2
  // digits of the referrer's phone number to anyone scanning issued codes.
  const base = codeFromName(existing.fullName);
  const candidates = [];
  if (base) {
    candidates.push(base);
    for (let i = 0; i < 26; i++) {
      candidates.push(`${base}${String.fromCharCode(65 + i)}`);
    }
  }
  for (let i = 0; i < 30; i++) candidates.push(randomCode());

  for (const code of candidates) {
    try {
      const updated = await prisma.referrer.updateMany({
        where: { id: referrerId, referralCode: null },
        data: { referralCode: code, referralCodeCreatedAt: new Date() },
      });

      if (updated.count === 1) return code;

      const latest = await prisma.referrer.findUnique({
        where: { id: referrerId },
        select: { referralCode: true },
      });
      if (latest?.referralCode) return latest.referralCode;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        continue;
      }
      throw error;
    }
  }

  throw new Error("We couldn't generate a unique referral code. Please try again.");
}

export async function validateReferralCode(code) {
  const normalizedCode = normalizeReferralCode(code);
  if (!normalizedCode) return null;

  const referrer = await getReferrerByReferralCode(normalizedCode);
  if (!referrer) return null;

  return {
    referrer,
    normalizedCode,
  };
}

function firstNameOf(fullName) {
  if (!fullName) return "";
  return String(fullName).trim().split(/\s+/)[0] || "";
}

export function buildReferralDiscountSummary({ code, referrer, originalAmount }) {
  const amounts = computeBookingAmounts(originalAmount, Boolean(referrer));

  return {
    valid: Boolean(referrer),
    code: code ? normalizeReferralCode(code) : "",
    referrerId: referrer?.id ?? null,
    // Server-side / admin contexts may need the full name; never returned by
    // public APIs — surname + phone fallback would let an attacker walk the
    // referral-code space and harvest PII.
    referrerName: referrer?.fullName || "",
    // Public APIs return the first name only (e.g. "Linked to Alice."). The
    // attack surface is reduced from "full identity" to "first names of
    // active referrers" — common given-name strings, weak identifier.
    referrerFirstName: firstNameOf(referrer?.fullName),
    ...amounts,
  };
}

export function buildReferrerBookingView(booking) {
  const statusLabel = formatReferrerBookingStatusLabel(booking.status);
  const commissionPaid = isCommissionPaidStatus(booking.status);
  const commissionPending = isCommissionPendingStatus(booking.status);

  return {
    ...booking,
    statusLabel,
    commissionPaid,
    commissionPending,
    commissionStateLabel: getCommissionStateLabel(booking.status),
  };
}

export async function getReferrerDashboardData(referrerId) {
  const referrer = await prisma.referrer.findUnique({
    where: { id: referrerId },
    include: {
      referrals: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!referrer) {
    return null;
  }

  const bookings = referrer.referrals.map(buildReferrerBookingView);
  const stats = {
    totalReferredBookings: bookings.length,
    confirmedBookings: bookings.filter(
      (booking) => booking.status === "CONFIRMED",
    ).length,
    completedBookings: bookings.filter((booking) =>
      isCompletedBookingStatus(booking.status),
    ).length,
    pendingCommission: bookings.reduce((total, booking) => {
      if (!booking.commissionPending) return total;
      return total + (booking.commissionAmount ?? 0);
    }, 0),
    paidCommission: bookings.reduce((total, booking) => {
      if (!booking.commissionPaid) return total;
      return total + (booking.commissionAmount ?? 0);
    }, 0),
  };

  return {
    referrer,
    bookings,
    stats,
  };
}

export async function updateReferrerBankDetails(referrerId, { bankAccountName, bsb, bankAccountNumber }) {
  return prisma.referrer.update({
    where: { id: referrerId },
    data: {
      bankAccountName: bankAccountName.trim(),
      bsb,
      bankAccountNumber: bankAccountNumber.trim(),
      bankDetailsUpdatedAt: new Date(),
    },
  });
}

export async function getAllReferrersForAdmin() {
  return prisma.referrer.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { referrals: true } },
      referrals: {
        where: { status: "COMMISSION_PAID" },
        select: { commissionAmount: true },
      },
    },
  });
}
