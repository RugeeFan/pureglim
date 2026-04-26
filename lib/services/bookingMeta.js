import { BookingStatus } from "@prisma/client";

export const PARTNER_DISCOUNT_AMOUNT = 20;
export const PARTNER_COMMISSION_AMOUNT = 10;
export const REFERRAL_DISCOUNT_AMOUNT = PARTNER_DISCOUNT_AMOUNT;
export const REFERRAL_COMMISSION_AMOUNT = PARTNER_COMMISSION_AMOUNT;

export const BOOKING_STATUS_VALUES = [
  BookingStatus.NEW,
  BookingStatus.CONFIRMED,
  BookingStatus.COMPLETE,
  BookingStatus.COMMISSION_PAID,
];

const BOOKING_STATUS_CONFIG = {
  [BookingStatus.NEW]: {
    label: "New",
    description: "Customer submitted the booking and it is awaiting admin confirmation.",
  },
  [BookingStatus.CONFIRMED]: {
    label: "Confirmed",
    description: "The booking has been confirmed and is going ahead.",
  },
  [BookingStatus.COMPLETE]: {
    label: "Complete",
    description: "The service is complete, customer payment is received, and referral earnings are now payable.",
  },
  [BookingStatus.COMMISSION_PAID]: {
    label: "Commission paid",
    description: "The booking is complete and the referral earnings have been paid.",
  },
};

const BOOKING_STATUS_TRANSITIONS = {
  [BookingStatus.NEW]: [BookingStatus.CONFIRMED],
  [BookingStatus.CONFIRMED]: [BookingStatus.COMPLETE],
  [BookingStatus.COMPLETE]: [BookingStatus.COMMISSION_PAID],
  [BookingStatus.COMMISSION_PAID]: [],
};

export function formatServiceTypeLabel(serviceType) {
  const labels = {
    regular: "Regular Cleaning",
    end_of_lease: "End of Lease Cleaning",
    commercial: "Commercial Cleaning",
  };

  return labels[serviceType] ?? serviceType;
}

export function formatBookingStatusLabel(status) {
  return BOOKING_STATUS_CONFIG[status]?.label ?? status;
}

export function formatPartnerBookingStatusLabel(status) {
  return formatBookingStatusLabel(status);
}

export function formatReferrerBookingStatusLabel(status) {
  return formatBookingStatusLabel(status);
}

export function getBookingStatusDescription(status) {
  return BOOKING_STATUS_CONFIG[status]?.description ?? "";
}

export function getAllowedBookingStatusTransitions(status) {
  return BOOKING_STATUS_TRANSITIONS[status] ?? [];
}

export function canTransitionBookingStatus(currentStatus, nextStatus) {
  if (!currentStatus || !nextStatus) return false;
  if (currentStatus === nextStatus) return true;
  return getAllowedBookingStatusTransitions(currentStatus).includes(nextStatus);
}

export function getBookingStatusTransitionError(currentStatus, nextStatus) {
  if (canTransitionBookingStatus(currentStatus, nextStatus)) {
    return null;
  }

  const allowed = getAllowedBookingStatusTransitions(currentStatus);
  if (!allowed.length) {
    return `${formatBookingStatusLabel(currentStatus)} is the final status and cannot be changed further.`;
  }

  return `This booking can only move from ${formatBookingStatusLabel(currentStatus)} to ${allowed
    .map((status) => formatBookingStatusLabel(status))
    .join(" or ")}.`;
}

export function isCommissionPendingStatus(status) {
  return status === BookingStatus.COMPLETE;
}

export function isCommissionPaidStatus(status) {
  return status === BookingStatus.COMMISSION_PAID;
}

export function isCompletedBookingStatus(status) {
  return [BookingStatus.COMPLETE, BookingStatus.COMMISSION_PAID].includes(status);
}

export function getCommissionStateLabel(status) {
  if (isCommissionPaidStatus(status)) {
    return "Commission paid";
  }

  if (isCommissionPendingStatus(status)) {
    return "Pending earnings payout";
  }

  return "Not yet payable";
}

export function computeCommissionAmount(baseAmount) {
  if (baseAmount == null) return null;
  return PARTNER_COMMISSION_AMOUNT;
}

export function computeBookingAmounts(originalAmount, hasPartnerDiscount) {
  if (originalAmount == null) {
    return {
      originalAmount: null,
      discountAmount: 0,
      finalAmount: null,
      commissionBaseAmount: null,
      commissionAmount: null,
    };
  }

  const discountAmount = hasPartnerDiscount ? PARTNER_DISCOUNT_AMOUNT : 0;
  const finalAmount = Math.max(originalAmount - discountAmount, 0);
  const commissionBaseAmount = hasPartnerDiscount ? finalAmount : null;

  return {
    originalAmount,
    discountAmount,
    finalAmount,
    commissionBaseAmount,
    commissionAmount:
      commissionBaseAmount != null
        ? computeCommissionAmount(commissionBaseAmount)
        : null,
  };
}
