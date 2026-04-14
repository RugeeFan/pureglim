-- AlterTable
ALTER TABLE "public"."QuoteRequest" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "public"."Setting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("key")
);
