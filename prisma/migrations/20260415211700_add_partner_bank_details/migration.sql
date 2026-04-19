-- AlterTable
ALTER TABLE "public"."Partner" ADD COLUMN     "bankAccountName" TEXT,
ADD COLUMN     "bankAccountNumber" TEXT,
ADD COLUMN     "bankDetailsUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "bsb" TEXT;
