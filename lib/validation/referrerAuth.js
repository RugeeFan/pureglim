import { z } from "zod";

export const referrerAuthStartSchema = z.object({
  mode: z.enum(["login", "register"]),
  phone: z.string().trim().min(6, "Phone number is required."),
  fullName: z.string().trim().max(120).optional().default(""),
  password: z.string().min(8).optional(),
});

export const referrerAuthPasswordLoginSchema = z.object({
  phone: z.string().trim().min(6, "Phone number is required."),
  password: z.string().min(1, "Password is required."),
});

export const referrerAuthVerifySchema = z.object({
  code: z.string().trim().min(4, "Verification code is required.").max(10),
});

// Cap amount well above any realistic regular-cleaning total (largest
// plausible quote is ~AU$500). Without a cap, a hostile client could post
// amount: 999_999_999 and the discount-summary calc would echo absurd
// numbers back into the UI.
export const referralCodeValidationSchema = z.object({
  code: z.string().trim().min(2, "Referral code is required.").max(32),
  amount: z.number().int().nonnegative().max(100_000).nullable().optional(),
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
