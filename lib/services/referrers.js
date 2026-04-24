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
  let code = "PG";
  for (let i = 0; i < 6; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
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

  if (!/^\+\d{8,15}$/.test(value)) {
    return null;
  }

  return value;
}

export function normalizeReferralCode(input) {
  return input?.trim().toUpperCase().replace(/\s+/g, "") || "";
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
      throw new Error("That phone number already has a referral account. Please log in instead.");
    }

    return createReferrerAccount({ fullName, phone, passwordHash });
  }

  if (!existing) {
    throw new Error("We couldn't find a referral account for that phone number.");
  }

  return touchReferrerLogin(existing.id);
}

function phoneTail(phone) {
  return (phone || "").replace(/\D/g, "").slice(-2);
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

  const base = codeFromName(existing.fullName);
  const tail = phoneTail(existing.phone);
  const candidates = [];

  if (base) {
    // 1. Name only: PGSMITH
    candidates.push(base);
    // 2. Name + phone tail: PGSMITH96
    if (tail) candidates.push(`${base}${tail}`);
    // 3. Name + phone tail + letter A-Z: PGSMITH96A ... PGSMITH96Z
    if (tail) {
      for (let i = 0; i < 26; i++) {
        candidates.push(`${base}${tail}${String.fromCharCode(65 + i)}`);
      }
    }
  }
  // 4. Random codes as final fallback
  for (let i = 0; i < 10; i++) candidates.push(randomCode());

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

export function buildReferralDiscountSummary({ code, referrer, originalAmount }) {
  const amounts = computeBookingAmounts(originalAmount, Boolean(referrer));

  return {
    valid: Boolean(referrer),
    code: code ? normalizeReferralCode(code) : "",
    referrerId: referrer?.id ?? null,
    referrerName: referrer?.fullName || referrer?.phone || "",
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
