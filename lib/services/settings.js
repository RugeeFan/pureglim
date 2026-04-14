import prisma from "../prisma";

export const SETTING_KEYS = {
  NOTIFICATION_EMAIL: "notification_email",
  EMAIL_INTRO: "email_intro",
  EMAIL_FOOTER: "email_footer",
  CUSTOMER_EMAIL_INTRO: "customer_email_intro",
  CUSTOMER_EMAIL_FOOTER: "customer_email_footer",
};

// Returns the value for a single key, falling back to the provided default.
export async function getSetting(key, fallback = "") {
  const row = await prisma.setting.findUnique({ where: { key } });
  return row?.value || fallback;
}

// Returns an object of { key: value } for all requested keys.
export async function getSettings(keys) {
  const rows = await prisma.setting.findMany({ where: { key: { in: keys } } });
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return Object.fromEntries(keys.map((k) => [k, map[k] ?? ""]));
}

// Upserts multiple { key, value } pairs at once.
export async function updateSettings(entries) {
  await Promise.all(
    entries.map(({ key, value }) =>
      prisma.setting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      }),
    ),
  );
}
