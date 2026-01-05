/*
  Warnings:

  - You are about to drop the column `details` on the `AuditLog` table. All the data in the column will be lost.
  - Added the required column `description` to the `AuditLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attack" DROP CONSTRAINT "Attack_memberId_fkey";

-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "details",
ADD COLUMN     "description" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Attack" ADD CONSTRAINT "Attack_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
