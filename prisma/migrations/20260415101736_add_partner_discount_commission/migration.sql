-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."BookingStatus" ADD VALUE 'SCHEDULED';
ALTER TYPE "public"."BookingStatus" ADD VALUE 'COMPLETED';
ALTER TYPE "public"."BookingStatus" ADD VALUE 'PAID';
ALTER TYPE "public"."BookingStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "public"."QuoteRequest" ADD COLUMN     "commissionAmount" INTEGER,
ADD COLUMN     "commissionBaseAmount" INTEGER,
ADD COLUMN     "discountAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "finalAmount" INTEGER,
ADD COLUMN     "originalAmount" INTEGER,
ADD COLUMN     "partnerCode" TEXT,
ADD COLUMN     "partnerId" TEXT;

-- CreateTable
CREATE TABLE "public"."Partner" (
    "id" TEXT NOT NULL,
    "fullName" TEXT,
    "phone" TEXT NOT NULL,
    "discountCode" TEXT,
    "discountCodeCreatedAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Partner_phone_key" ON "public"."Partner"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_discountCode_key" ON "public"."Partner"("discountCode");

-- CreateIndex
CREATE INDEX "QuoteRequest_partnerId_createdAt_idx" ON "public"."QuoteRequest"("partnerId", "createdAt");

-- CreateIndex
CREATE INDEX "QuoteRequest_partnerCode_idx" ON "public"."QuoteRequest"("partnerCode");

-- CreateIndex
CREATE INDEX "QuoteRequest_status_createdAt_idx" ON "public"."QuoteRequest"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."QuoteRequest" ADD CONSTRAINT "QuoteRequest_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "public"."Partner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
