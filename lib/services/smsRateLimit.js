import prisma from "../prisma";

const RATE_LIMIT_SECONDS = 60;

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
