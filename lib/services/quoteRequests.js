import { BookingStatus, ServiceType } from "@prisma/client";
import prisma from "../prisma";
import {
  deepCleaningAddOns,
  getHourlyPrice,
  getRegularPrice,
} from "../../app/data/constants";
import {
  BOOKING_STATUS_VALUES,
  canTransitionBookingStatus,
  canUndoBookingStatus,
  formatBookingStatusLabel,
  formatServiceTypeLabel as formatServiceTypeLabelInternal,
  getBookingStatusTransitionError,
  getCommissionStateLabel,
  isCommissionPaidStatus,
  computeBookingAmounts,
} from "./bookingMeta";
import { validateReferralCode } from "./referrers";
import {
  isReferralDiscountEligibleService,
  normalizeReferralCode,
} from "../referral/shared";

const serviceTypeEnumMap = {
  regular: ServiceType.REGULAR,
  end_of_lease: ServiceType.END_OF_LEASE,
  commercial: ServiceType.COMMERCIAL,
  hourly: ServiceType.HOURLY,
};

export function formatServiceTypeLabel(serviceType) {
  return formatServiceTypeLabelInternal(serviceType);
}

function normalizeAddOns(addOnIds) {
  return deepCleaningAddOns
    .filter((item) => addOnIds.includes(item.id))
    .map((item) => ({
      id: item.id,
      label: item.label,
      price: item.price,
    }));
}

function getPricingReferenceAmount(data) {
  if (data.serviceType === "hourly") {
    if (data.hourlyHours) {
      return getHourlyPrice(data.hourlyHours);
    }
    return data.estimatedPrice ?? null;
  }

  const isRecurringRegular =
    data.serviceType === "regular" &&
    Boolean(data.frequency) &&
    data.frequency !== "One-time" &&
    Boolean(data.bedrooms) &&
    Boolean(data.bathrooms);

  if (isRecurringRegular) {
    return getRegularPrice(data.bedrooms, data.bathrooms, "One-time");
  }

  return data.estimatedPrice ?? null;
}

// 14 days is enough to catch the "I forgot I already submitted" case while
// not blocking a real return customer (cleaning intervals are typically
// 1-4 weeks). Tune by observation if false-positive rate is too high.
const DUPLICATE_BOOKING_WINDOW_DAYS = 14;

const ACTIVE_BOOKING_STATUSES = [
  BookingStatus.NEW,
  BookingStatus.CONFIRMED,
  BookingStatus.COMPLETE,
];

export async function findRecentDuplicateBooking(tx, phone) {
  if (!phone) return null;
  const cutoff = new Date(Date.now() - DUPLICATE_BOOKING_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  return tx.quoteRequest.findFirst({
    where: {
      phone,
      status: { in: ACTIVE_BOOKING_STATUSES },
      createdAt: { gte: cutoff },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createQuoteRequest(data) {
  const addOns = data.serviceType === "end_of_lease" ? normalizeAddOns(data.addOns) : [];
  const normalizedReferralCode = normalizeReferralCode(data.discountCode);
  const eligibleForDiscount =
    Boolean(normalizedReferralCode) && isReferralDiscountEligibleService(data.serviceType);

  // The referrer lookup and the booking insert MUST run in the same
  // transaction. Without the tx, an admin could deactivate (or another
  // process could rotate the code on) a referrer between read and write,
  // and the booking would still land with `referrerId` pointing at an
  // inactive account — silently accruing commission to a stale snapshot.
  return prisma.$transaction(async (tx) => {
    // Duplicate guard: if the same phone already has an active booking in
    // the last DUPLICATE_BOOKING_WINDOW_DAYS, return a duplicate result
    // instead of inserting. The route turns this into a 200 + duplicate:true
    // payload so the customer sees a friendly "already received" message.
    const duplicate = await findRecentDuplicateBooking(tx, data.phone);
    if (duplicate) {
      return {
        duplicate: true,
        existingId: duplicate.id,
        existingStatus: duplicate.status,
        existingCreatedAt: duplicate.createdAt,
      };
    }

    let resolvedReferrer = null;
    let resolvedCode = null;

    if (eligibleForDiscount) {
      const found = await tx.referrer.findFirst({
        where: {
          referralCode: normalizedReferralCode,
          isActive: true,
        },
      });
      if (found) {
        resolvedReferrer = found;
        resolvedCode = normalizedReferralCode;
      }
    }

    const pricing = computeBookingAmounts(
      getPricingReferenceAmount(data),
      Boolean(resolvedReferrer),
    );

    const booking = await tx.quoteRequest.create({
      data: {
        serviceType: serviceTypeEnumMap[data.serviceType],
        customerName: data.customerName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        bedrooms: data.bedrooms || null,
        bathrooms: data.bathrooms || null,
        frequency: data.frequency || null,
        hourlyHours: data.serviceType === "hourly" ? (data.hourlyHours ?? null) : null,
        companyName: data.companyName || null,
        siteType: data.siteType || null,
        siteSchedule: data.siteSchedule || null,
        addOns: addOns.length ? addOns : null,
        estimatedPrice: data.estimatedPrice ?? null,
        originalAmount: pricing.originalAmount,
        discountAmount: pricing.discountAmount,
        finalAmount: pricing.finalAmount,
        commissionBaseAmount: pricing.commissionBaseAmount,
        commissionAmount: pricing.commissionAmount,
        referralCode: resolvedCode,
        referrerId: resolvedReferrer?.id ?? null,
        notes: data.notes || null,
        preferredDate: data.preferredDate || null,
        preferredTime: data.preferredTime || null,
        status: BookingStatus.NEW,
      },
      include: {
        referrer: true,
      },
    });

    return { duplicate: false, booking };
  });
}

export function buildQuoteRequestReference(id) {
  return `PG-${id.slice(-6).toUpperCase()}`;
}

export function formatQuoteRequestStatusLabel(status) {
  return formatBookingStatusLabel(status);
}

export function getQuoteRequestCommissionStateLabel(enquiry) {
  if (!enquiry.referrerId) return null;
  return getCommissionStateLabel(enquiry.status);
}

// ── Admin queries ─────────────────────────────────────────────────────────────

export async function getQuoteRequests({ page = 1, pageSize = 15, search = "", status = "", view = "" } = {}) {
  const skip = (page - 1) * pageSize;

  const conditions = [];
  if (search) {
    conditions.push({
      OR: [
        { customerName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { referralCode: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  // view=followup pins to "NEW + older than 24h" and overrides any explicit
  // status param. view=today is orthogonal — combines with status.
  if (view === "followup") {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    conditions.push({ status: BookingStatus.NEW, createdAt: { lt: dayAgo } });
  } else {
    if (view === "today") {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      conditions.push({ createdAt: { gte: startOfToday } });
    }
    if (status && BookingStatus[status]) {
      conditions.push({ status: BookingStatus[status] });
    }
  }

  const where = conditions.length ? { AND: conditions } : {};

  const [items, total] = await prisma.$transaction([
    prisma.quoteRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: {
        referrer: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            referralCode: true,
          },
        },
      },
    }),
    prisma.quoteRequest.count({ where }),
  ]);
  return { items, total };
}

export async function deleteAllQuoteRequests() {
  return prisma.quoteRequest.deleteMany({});
}

export async function getEnquirySummaryCounts() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [todayNew, needFollowUp, pendingConfirmation] = await prisma.$transaction([
    prisma.quoteRequest.count({
      where: { createdAt: { gte: startOfToday } },
    }),
    prisma.quoteRequest.count({
      where: {
        createdAt: { lt: dayAgo },
        status: BookingStatus.NEW,
      },
    }),
    prisma.quoteRequest.count({
      where: { status: BookingStatus.NEW },
    }),
  ]);

  return { todayNew, needFollowUp, pendingConfirmation };
}

export async function getQuoteRequestById(id) {
  return prisma.quoteRequest.findUnique({
    where: { id },
    include: {
      referrer: true,
    },
  });
}

// Single-tenant admin — actor identity is fixed today. When per-user admin
// sessions are introduced, plumb the session id/name through these calls.
const ADMIN_ACTOR = { actorType: "ADMIN", actorName: "admin" };

async function recordEnquiryActivity(tx, entry) {
  return tx.enquiryActivityLog.create({
    data: {
      quoteRequestId: entry.quoteRequestId,
      actorType: entry.actorType ?? ADMIN_ACTOR.actorType,
      actorName: entry.actorName ?? ADMIN_ACTOR.actorName,
      action: entry.action,
      fromStatus: entry.fromStatus ?? null,
      toStatus: entry.toStatus ?? null,
      message: entry.message ?? null,
    },
  });
}

export async function updateQuoteRequestStatus(id, status) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.quoteRequest.findUnique({
      where: { id },
      include: {
        referrer: true,
      },
    });

    if (!existing) {
      throw new Error("Booking not found.");
    }

    if (!canTransitionBookingStatus(existing.status, status)) {
      throw new Error(getBookingStatusTransitionError(existing.status, status));
    }

    if (existing.status === status) {
      return existing;
    }

    const updated = await tx.quoteRequest.update({
      where: { id },
      data: { status },
      include: {
        referrer: true,
      },
    });

    await recordEnquiryActivity(tx, {
      quoteRequestId: id,
      action: status === "COMMISSION_PAID" ? "COMMISSION_MARKED_PAID" : "STATUS_CHANGED",
      fromStatus: existing.status,
      toStatus: status,
    });

    return updated;
  });
}

export async function deleteQuoteRequest(id) {
  return prisma.quoteRequest.delete({ where: { id } });
}

export class InvalidStatusUndoError extends Error {
  constructor(currentStatus, attemptedStatus) {
    super(
      `Cannot undo ${formatBookingStatusLabel(currentStatus)} to ${formatBookingStatusLabel(attemptedStatus)}.`,
    );
    this.name = "InvalidStatusUndoError";
  }
}

export async function undoQuoteRequestStatus(id, previousStatus) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.quoteRequest.findUnique({
      where: { id },
      include: { referrer: true },
    });

    if (!existing) {
      throw new Error("Booking not found.");
    }

    if (!canUndoBookingStatus(existing.status, previousStatus)) {
      throw new InvalidStatusUndoError(existing.status, previousStatus);
    }

    if (existing.status === previousStatus) {
      return existing;
    }

    const updated = await tx.quoteRequest.update({
      where: { id },
      data: { status: previousStatus },
      include: { referrer: true },
    });

    await recordEnquiryActivity(tx, {
      quoteRequestId: id,
      action: "STATUS_CHANGED",
      fromStatus: existing.status,
      toStatus: previousStatus,
      message: "reverted",
    });

    return updated;
  });
}

// Returns { changed: boolean, updated: QuoteRequest }. Whitespace-only or
// identical submissions are treated as no-ops so the activity timeline does
// not accumulate empty NOTE_UPDATED entries.
export async function updateInternalNotes(id, rawNotes) {
  const next = typeof rawNotes === "string" ? rawNotes.trim() : "";

  return prisma.$transaction(async (tx) => {
    const existing = await tx.quoteRequest.findUnique({
      where: { id },
      select: { id: true, internalNotes: true },
    });

    if (!existing) {
      throw new Error("Booking not found.");
    }

    const current = existing.internalNotes ?? "";
    if (current === next) {
      return { changed: false, updated: existing };
    }

    const updated = await tx.quoteRequest.update({
      where: { id },
      data: {
        internalNotes: next === "" ? null : next,
        internalNotesUpdatedAt: new Date(),
      },
      select: { id: true, internalNotes: true, internalNotesUpdatedAt: true },
    });

    await recordEnquiryActivity(tx, {
      quoteRequestId: id,
      action: "NOTE_UPDATED",
      message: next === "" ? "cleared" : null,
    });

    return { changed: true, updated };
  });
}

export async function getEnquiryActivityLogs(quoteRequestId, { take = 50 } = {}) {
  return prisma.enquiryActivityLog.findMany({
    where: { quoteRequestId },
    orderBy: { createdAt: "desc" },
    take,
  });
}
