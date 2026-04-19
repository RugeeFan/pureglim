DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "public"."QuoteRequest"
    WHERE "status" = 'CANCELLED'
  ) THEN
    RAISE EXCEPTION 'Cannot migrate BookingStatus while QuoteRequest rows still use CANCELLED. Resolve or remove cancelled bookings before applying this migration.';
  END IF;
END $$;

ALTER TABLE "public"."QuoteRequest"
  ALTER COLUMN "status" DROP DEFAULT;

ALTER TYPE "public"."BookingStatus" RENAME TO "BookingStatus_old";

CREATE TYPE "public"."BookingStatus" AS ENUM (
  'NEW',
  'CONFIRMED',
  'COMPLETE',
  'COMMISSION_PAID'
);

ALTER TABLE "public"."QuoteRequest"
  ALTER COLUMN "status" TYPE "public"."BookingStatus"
  USING (
    CASE
      WHEN "status"::text = 'NEW' THEN 'NEW'
      WHEN "status"::text IN ('CONTACTED', 'QUOTED', 'SCHEDULED') THEN 'CONFIRMED'
      WHEN "status"::text = 'COMPLETED' THEN 'COMPLETE'
      WHEN "status"::text = 'PAID' THEN 'COMMISSION_PAID'
      ELSE NULL
    END
  )::"public"."BookingStatus";

DROP TYPE "public"."BookingStatus_old";

ALTER TABLE "public"."QuoteRequest"
  ALTER COLUMN "status" SET DEFAULT 'NEW';
