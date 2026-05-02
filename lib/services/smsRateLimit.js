import prisma from "../prisma";
import { Prisma } from "@prisma/client";

const RATE_LIMIT_SECONDS = 60;

function buildDeniedResult(lastSentAt) {
  const elapsed = (Date.now() - lastSentAt.getTime()) / 1000;
  return {
    allowed: false,
    secondsLeft: Math.max(1, Math.ceil(RATE_LIMIT_SECONDS - elapsed)),
  };
}

export async function checkSmsRateLimit(phone) {
  const row = await prisma.smsRateLimit.findUnique({ where: { phone } });
  if (!row) return { allowed: true, secondsLeft: 0 };

  const elapsed = (Date.now() - row.lastSentAt.getTime()) / 1000;
  if (elapsed >= RATE_LIMIT_SECONDS) return { allowed: true, secondsLeft: 0 };

  return { allowed: false, secondsLeft: Math.ceil(RATE_LIMIT_SECONDS - elapsed) };
}

export async function setSmsRateLimit(phone) {
  await prisma.smsRateLimit.upsert({
    where: { phone },
    create: { phone, lastSentAt: new Date() },
    update: { lastSentAt: new Date() },
  });
}

export async function reserveSmsRateLimit(phone) {
  const now = new Date();
  const cutoff = new Date(now.getTime() - RATE_LIMIT_SECONDS * 1000);
  const existing = await prisma.smsRateLimit.findUnique({ where: { phone } });

  if (!existing) {
    try {
      await prisma.smsRateLimit.create({
        data: { phone, lastSentAt: now },
      });
      return {
        allowed: true,
        reservation: {
          phone,
          created: true,
          reservedAt: now,
        },
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const latest = await prisma.smsRateLimit.findUnique({ where: { phone } });
        if (latest) {
          return buildDeniedResult(latest.lastSentAt);
        }
      }
      throw error;
    }
  }

  if (existing.lastSentAt > cutoff) {
    return buildDeniedResult(existing.lastSentAt);
  }

  const updated = await prisma.smsRateLimit.updateMany({
    where: { phone, lastSentAt: existing.lastSentAt },
    data: { lastSentAt: now },
  });

  if (updated.count === 1) {
    return {
      allowed: true,
      reservation: {
        phone,
        created: false,
        reservedAt: now,
        previousLastSentAt: existing.lastSentAt,
      },
    };
  }

  const latest = await prisma.smsRateLimit.findUnique({ where: { phone } });
  if (!latest) {
    return {
      allowed: true,
      reservation: {
        phone,
        created: true,
        reservedAt: now,
      },
    };
  }

  return buildDeniedResult(latest.lastSentAt);
}

export async function rollbackSmsRateLimitReservation(reservation) {
  if (!reservation) return;

  if (reservation.created) {
    await prisma.smsRateLimit.deleteMany({
      where: {
        phone: reservation.phone,
        lastSentAt: reservation.reservedAt,
      },
    });
    return;
  }

  if (reservation.previousLastSentAt) {
    await prisma.smsRateLimit.updateMany({
      where: {
        phone: reservation.phone,
        lastSentAt: reservation.reservedAt,
      },
      data: { lastSentAt: reservation.previousLastSentAt },
    });
  }
}

const IP_KEY_PREFIX = "ip:";

export async function reserveIpSmsAttempt(ip) {
  if (!ip) return { allowed: true, reservation: null };
  return reserveSmsRateLimit(`${IP_KEY_PREFIX}${ip}`);
}
