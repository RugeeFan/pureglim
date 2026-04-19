import { BookingStatus, ServiceType } from "@prisma/client";
import prisma from "../prisma";
import { deepCleaningAddOns } from "../../app/data/constants";
import {
  BOOKING_STATUS_VALUES,
  canTransitionBookingStatus,
  formatBookingStatusLabel,
  formatServiceTypeLabel as formatServiceTypeLabelInternal,
  getBookingStatusTransitionError,
  getCommissionStateLabel,
  isCommissionPaidStatus,
  computeBookingAmounts,
} from "./bookingMeta";
import { validateReferralCode } from "./referrers";

const serviceTypeEnumMap = {
  regular: ServiceType.REGULAR,
  end_of_lease: ServiceType.END_OF_LEASE,
  commercial: ServiceType.COMMERCIAL,
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

export async function createQuoteRequest(data) {
  if (data.serviceType === "commercial" && data.discountCode) {
    throw new Error("Discount codes are only available for residential and end of lease bookings.");
  }

  const addOns = data.serviceType === "end_of_lease" ? normalizeAddOns(data.addOns) : [];
  const discountMatch = data.discountCode
    ? await validateReferralCode(data.discountCode)
    : null;

  if (data.discountCode && !discountMatch) {
    throw new Error("That referral code is no longer valid. Please double-check it and try again.");
  }

  const pricing = computeBookingAmounts(
    data.estimatedPrice ?? null,
    Boolean(discountMatch?.referrer),
  );

  return prisma.quoteRequest.create({
    data: {
      serviceType: serviceTypeEnumMap[data.serviceType],
      customerName: data.customerName,
      phone: data.phone,
      email: data.email,
      address: data.address,
      bedrooms: data.bedrooms || null,
      bathrooms: data.bathrooms || null,
      frequency: data.frequency || null,
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
      referralCode: discountMatch?.normalizedCode ?? null,
      referrerId: discountMatch?.referrer.id ?? null,
      notes: data.notes || null,
      preferredDate: data.preferredDate || null,
      preferredTime: data.preferredTime || null,
      status: BookingStatus.NEW,
    },
    include: {
      referrer: true,
    },
  });
}

export function buildQuoteRequestReference(id) {
  return `PG-${id.slice(-6).toUpperCase()}`;
}

export function formatQuoteRequestStatusLabel(status) {
  return formatBookingStatusLabel(status);
}

export function getQuoteRequestStatusOptions() {
  return BOOKING_STATUS_VALUES;
}

export function isQuoteRequestCommissionEarned(enquiry) {
  return Boolean(enquiry.referrerId && isCommissionPaidStatus(enquiry.status));
}

export function getQuoteRequestCommissionStateLabel(enquiry) {
  if (!enquiry.referrerId) return null;
  return getCommissionStateLabel(enquiry.status);
}

// ── Admin queries ─────────────────────────────────────────────────────────────

export async function getQuoteRequests({ page = 1, pageSize = 15, search = "", status = "" } = {}) {
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
  if (status && BookingStatus[status]) {
    conditions.push({ status: BookingStatus[status] });
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

export async function getQuoteRequestById(id) {
  return prisma.quoteRequest.findUnique({
    where: { id },
    include: {
      referrer: true,
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

    return tx.quoteRequest.update({
      where: { id },
      data: { status },
      include: {
        referrer: true,
      },
    });
  });
}

export async function deleteQuoteRequest(id) {
  return prisma.quoteRequest.delete({ where: { id } });
}

export async function forceSetQuoteRequestStatus(id, status) {
  return prisma.quoteRequest.update({ where: { id }, data: { status } });
}
