-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('REGULAR', 'END_OF_LEASE', 'COMMERCIAL');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('NEW', 'CONTACTED', 'QUOTED');

-- CreateTable
CREATE TABLE "QuoteRequest" (
    "id" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "customerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "bedrooms" TEXT,
    "bathrooms" TEXT,
    "frequency" TEXT,
    "companyName" TEXT,
    "siteType" TEXT,
    "siteSchedule" TEXT,
    "addOns" JSONB,
    "estimatedPrice" INTEGER,
    "notes" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteRequest_pkey" PRIMARY KEY ("id")
);
