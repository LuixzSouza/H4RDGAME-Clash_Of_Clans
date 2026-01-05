/*
  Warnings:

  - You are about to drop the column `description` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `isInWhatsapp` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `lastPayment` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `tickets` on the `Member` table. All the data in the column will be lost.
  - Added the required column `details` to the `AuditLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attack" DROP CONSTRAINT "Attack_memberId_fkey";

-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "description",
ADD COLUMN     "details" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "isInWhatsapp",
DROP COLUMN "lastPayment",
DROP COLUMN "tickets";

-- AlterTable
ALTER TABLE "PaymentHistory" ADD COLUMN     "financeEventId" TEXT;

-- CreateTable
CREATE TABLE "FinanceEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "ticketPrice" DOUBLE PRECISION NOT NULL,
    "goalAmount" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinanceEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventParticipation" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "tickets" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventParticipation_eventId_memberId_key" ON "EventParticipation"("eventId", "memberId");

-- AddForeignKey
ALTER TABLE "EventParticipation" ADD CONSTRAINT "EventParticipation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "FinanceEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventParticipation" ADD CONSTRAINT "EventParticipation_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentHistory" ADD CONSTRAINT "PaymentHistory_financeEventId_fkey" FOREIGN KEY ("financeEventId") REFERENCES "FinanceEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attack" ADD CONSTRAINT "Attack_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
