-- CreateEnum
CREATE TYPE "Role" AS ENUM ('LIDER', 'COLIDER', 'ANCIAO', 'MEMBRO');

-- CreateEnum
CREATE TYPE "WarPreference" AS ENUM ('IN', 'OUT');

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "avatarSeed" TEXT,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "isInWhatsapp" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'MEMBRO',
    "thLevel" INTEGER NOT NULL DEFAULT 1,
    "warStatus" "WarPreference" NOT NULL DEFAULT 'IN',
    "strikes" INTEGER NOT NULL DEFAULT 0,
    "tickets" INTEGER NOT NULL DEFAULT 0,
    "lastPayment" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentHistory" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "tickets" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "memberId" TEXT NOT NULL,

    CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "memberId" TEXT,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL DEFAULT 'global_config',
    "ticketPrice" DOUBLE PRECISION NOT NULL DEFAULT 2.00,
    "skinGoal" DOUBLE PRECISION NOT NULL DEFAULT 44.90,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Strategy" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thLevel" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "videoUrl" TEXT,
    "army" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Strategy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Layout" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thLevel" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Layout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "War" (
    "id" TEXT NOT NULL,
    "opponentName" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "result" TEXT,
    "score" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isLeague" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "War_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attack" (
    "id" TEXT NOT NULL,
    "warId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "attackNumber" INTEGER NOT NULL,
    "target" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "destruction" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_tag_key" ON "Member"("tag");

-- CreateIndex
CREATE INDEX "Member_name_idx" ON "Member"("name");

-- AddForeignKey
ALTER TABLE "PaymentHistory" ADD CONSTRAINT "PaymentHistory_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attack" ADD CONSTRAINT "Attack_warId_fkey" FOREIGN KEY ("warId") REFERENCES "War"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attack" ADD CONSTRAINT "Attack_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
