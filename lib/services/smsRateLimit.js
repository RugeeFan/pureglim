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

// Per-action rate limiter for non-SMS write endpoints (e.g., referral code
// regeneration, bank details update). Reuses the SmsRateLimit table because
// the semantics are identical: one mutation per key per RATE_LIMIT_SECONDS
// window. Key format: "act:<scope>:<id>" — e.g. "act:gen:<referrerId>".
const ACTION_KEY_PREFIX = "act:";

export async function reserveActionRateLimit(scope, id) {
  if (!scope || !id) return { allowed: true, reservation: null };
  return reserveSmsRateLimit(`${ACTION_KEY_PREFIX}${scope}:${id}`);
}
