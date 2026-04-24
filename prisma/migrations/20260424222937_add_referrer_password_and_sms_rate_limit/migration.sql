-- AlterTable
ALTER TABLE "public"."Referrer" ADD COLUMN     "passwordHash" TEXT;

-- CreateTable
CREATE TABLE "public"."SmsRateLimit" (
    "phone" TEXT NOT NULL,
    "lastSentAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmsRateLimit_pkey" PRIMARY KEY ("phone")
);
