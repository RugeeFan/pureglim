import { BookingStatus, ServiceType } from "@prisma/client";
import prisma from "../prisma";
import { deepCleaningAddOns } from "../../app/data/constants";

const serviceTypeEnumMap = {
  regular: ServiceType.REGULAR,
  end_of_lease: ServiceType.END_OF_LEASE,
  commercial: ServiceType.COMMERCIAL,
};

export function formatServiceTypeLabel(serviceType) {
  const labels = {
    regular: "Regular Cleaning",
    end_of_lease: "End of Lease Cleaning",
    commercial: "Commercial Cleaning",
  };

  return labels[serviceType] ?? serviceType;
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
  const addOns = data.serviceType === "end_of_lease" ? normalizeAddOns(data.addOns) : [];

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
      notes: data.notes || null,
      preferredDate: data.preferredDate || null,
      preferredTime: data.preferredTime || null,
      status: BookingStatus.NEW,
    },
  });
}

export function buildQuoteRequestReference(id) {
  return `PG-${id.slice(-6).toUpperCase()}`;
}

// ── Admin queries ─────────────────────────────────────────────────────────────

export async function getQuoteRequests({ page = 1, pageSize = 15 } = {}) {
  const skip = (page - 1) * pageSize;
  const [items, total] = await prisma.$transaction([
    prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.quoteRequest.count(),
  ]);
  return { items, total };
}

export async function deleteAllQuoteRequests() {
  return prisma.quoteRequest.deleteMany({});
}

export async function getQuoteRequestById(id) {
  return prisma.quoteRequest.findUnique({ where: { id } });
}

export async function updateQuoteRequestStatus(id, status) {
  return prisma.quoteRequest.update({ where: { id }, data: { status } });
}

export async function deleteQuoteRequest(id) {
  return prisma.quoteRequest.delete({ where: { id } });
}
