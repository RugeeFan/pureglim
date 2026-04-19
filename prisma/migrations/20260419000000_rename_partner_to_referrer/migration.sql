-- Rename Partner table to Referrer
ALTER TABLE "Partner" RENAME TO "Referrer";

-- Rename columns on Referrer
ALTER TABLE "Referrer" RENAME COLUMN "discountCode" TO "referralCode";
ALTER TABLE "Referrer" RENAME COLUMN "discountCodeCreatedAt" TO "referralCodeCreatedAt";

-- Rename columns on QuoteRequest
ALTER TABLE "QuoteRequest" RENAME COLUMN "partnerCode" TO "referralCode";
ALTER TABLE "QuoteRequest" RENAME COLUMN "partnerId" TO "referrerId";

-- Drop old indexes on QuoteRequest
DROP INDEX IF EXISTS "QuoteRequest_partnerId_createdAt_idx";
DROP INDEX IF EXISTS "QuoteRequest_partnerCode_idx";

-- Drop old unique constraint on Partner (now Referrer)
ALTER TABLE "Referrer" DROP CONSTRAINT IF EXISTS "Partner_discountCode_key";
ALTER TABLE "Referrer" DROP CONSTRAINT IF EXISTS "Partner_phone_key";

-- Drop old FK constraint
ALTER TABLE "QuoteRequest" DROP CONSTRAINT IF EXISTS "QuoteRequest_partnerId_fkey";

-- Rename primary key constraint
ALTER TABLE "Referrer" RENAME CONSTRAINT "Partner_pkey" TO "Referrer_pkey";

-- Re-add constraints with new names
ALTER TABLE "Referrer" ADD CONSTRAINT "Referrer_phone_key" UNIQUE ("phone");
ALTER TABLE "Referrer" ADD CONSTRAINT "Referrer_referralCode_key" UNIQUE ("referralCode");

-- Re-add FK constraint
ALTER TABLE "QuoteRequest" ADD CONSTRAINT "QuoteRequest_referrerId_fkey"
  FOREIGN KEY ("referrerId") REFERENCES "Referrer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Re-add indexes
CREATE INDEX "QuoteRequest_referrerId_createdAt_idx" ON "QuoteRequest"("referrerId", "createdAt");
CREATE INDEX "QuoteRequest_referralCode_idx" ON "QuoteRequest"("referralCode");
