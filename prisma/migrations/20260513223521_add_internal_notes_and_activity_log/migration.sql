-- AlterTable
ALTER TABLE "public"."QuoteRequest" ADD COLUMN     "internalNotes" TEXT,
ADD COLUMN     "internalNotesUpdatedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."EnquiryActivityLog" (
    "id" TEXT NOT NULL,
    "quoteRequestId" TEXT NOT NULL,
    "actorType" TEXT NOT NULL,
    "actorName" TEXT,
    "action" TEXT NOT NULL,
    "fromStatus" TEXT,
    "toStatus" TEXT,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnquiryActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EnquiryActivityLog_quoteRequestId_createdAt_idx" ON "public"."EnquiryActivityLog"("quoteRequestId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."EnquiryActivityLog" ADD CONSTRAINT "EnquiryActivityLog_quoteRequestId_fkey" FOREIGN KEY ("quoteRequestId") REFERENCES "public"."QuoteRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
