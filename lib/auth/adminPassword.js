import prisma from "../prisma";
import { hashPassword, verifyPassword } from "../utils/password";

export const ADMIN_PASSWORD_KEY = "admin_password_hash";

export async function verifyAdminPassword(plain) {
  const row = await prisma.setting.findUnique({ where: { key: ADMIN_PASSWORD_KEY } });
  if (row?.value) {
    return verifyPassword(plain, row.value);
  }
  return plain === process.env.ADMIN_PASSWORD;
}

export async function setAdminPassword(newPlain) {
  const hash = await hashPassword(newPlain);
  await prisma.setting.upsert({
    where: { key: ADMIN_PASSWORD_KEY },
    create: { key: ADMIN_PASSWORD_KEY, value: hash },
    update: { value: hash },
  });
}
