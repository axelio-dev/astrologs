-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('IN_PROGRESS', 'PROCESSING', 'COMPLETED');

-- CreateTable
CREATE TABLE "astro_session" (
    "id" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalDuration" TEXT,
    "telescopeId" TEXT,
    "cameraId" TEXT,
    "mountId" TEXT,
    "frameCount" INTEGER NOT NULL DEFAULT 0,
    "exposureTime" DOUBLE PRECISION,
    "notes" TEXT,
    "status" "SessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "filterIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "accessoryIds" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "astro_session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "astro_session_userId_idx" ON "astro_session"("userId");

-- AddForeignKey
ALTER TABLE "astro_session" ADD CONSTRAINT "astro_session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
