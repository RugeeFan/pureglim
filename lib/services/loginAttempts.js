import prisma from "../prisma";

// Failed-login counter with time-windowed lockout. Distinct from SmsRateLimit:
// SmsRateLimit gates outbound SMS sends (1 per phone per 60s), which is the
// correct UX for "wait 60s before resending the code". This module gates
// password-style login attempts where the right semantics are "N strikes
// before a temporary lock", so a single typo doesn't punish the user.

export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_MINUTES = 10;
const LOCKOUT_MS = LOCKOUT_MINUTES * 60 * 1000;

export async function checkLoginAttempt(key) {
  if (!key) return { locked: false, secondsLeft: 0, attempts: 0 };
  const row = await prisma.loginAttempt.findUnique({ where: { key } });
  if (!row) return { locked: false, secondsLeft: 0, attempts: 0 };

  const now = Date.now();
  if (!row.lockedUntil) {
    return { locked: false, secondsLeft: 0, attempts: row.attempts };
  }

  const until = row.lockedUntil.getTime();
  if (until <= now) {
    // Lockout expired; treat as unlocked. The counter is cleaned up the next
    // time recordLoginFailure runs (or by clearLoginAttempts on success).
    return { locked: false, secondsLeft: 0, attempts: row.attempts };
  }

  return {
    locked: true,
    secondsLeft: Math.max(1, Math.ceil((until - now) / 1000)),
    attempts: row.attempts,
  };
}

export async function recordLoginFailure(key) {
  if (!key) return { locked: false, attempts: 0 };
  const now = new Date();

  // If a previous lockout has already expired, reset the counter so the new
  // failure starts a fresh window. Cheap because the WHERE matches at most
  // one row (key is unique) and the predicate is index-only.
  await prisma.loginAttempt.updateMany({
    where: {
      key,
      lockedUntil: { not: null, lte: now },
    },
    data: {
      attempts: 0,
      lockedUntil: null,
    },
  });

  // Atomic increment via upsert. Two concurrent failures may both bump the
  // counter without serialization; that's acceptable — we'd hit the lockout
  // threshold one attempt earlier in the worst case, never later.
  const row = await prisma.loginAttempt.upsert({
    where: { key },
    create: {
      key,
      attempts: 1,
      lastAttemptAt: now,
    },
    update: {
      attempts: { increment: 1 },
      lastAttemptAt: now,
    },
  });

  if (row.attempts >= MAX_FAILED_ATTEMPTS && !row.lockedUntil) {
    const lockedRow = await prisma.loginAttempt.update({
      where: { key },
      data: { lockedUntil: new Date(now.getTime() + LOCKOUT_MS) },
    });
    return {
      locked: true,
      attempts: lockedRow.attempts,
      lockedUntil: lockedRow.lockedUntil,
    };
  }

  return { locked: false, attempts: row.attempts };
}

export async function clearLoginAttempts(key) {
  if (!key) return;
  await prisma.loginAttempt.deleteMany({ where: { key } });
}
