import { z } from "zod";

export const referrerAuthStartSchema = z.object({
  mode: z.enum(["login", "register"]),
  phone: z.string().trim().min(6, "Phone number is required."),
  fullName: z.string().trim().max(120).optional().default(""),
});

export const referrerAuthVerifySchema = z.object({
  code: z.string().trim().min(4, "Verification code is required.").max(10),
});

export const referralCodeValidationSchema = z.object({
  code: z.string().trim().min(2, "Referral code is required.").max(32),
  amount: z.number().int().nonnegative().nullable().optional(),
});

export const referrerBankDetailsSchema = z.object({
  bankAccountName: z.string().trim().min(2, "Account name is required.").max(100),
  bsb: z
    .string()
    .trim()
    .regex(/^\d{3}-?\d{3}$/, "BSB must be 6 digits (e.g. 062-000)."),
  bankAccountNumber: z
    .string()
    .trim()
    .regex(/^\d{6,9}$/, "Account number must be 6–9 digits."),
});
