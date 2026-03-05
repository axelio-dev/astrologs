-- CreateEnum
CREATE TYPE "EquipmentCategory" AS ENUM ('TELESCOPE', 'CAMERA', 'MOUNT', 'FILTER', 'ACCESSORY', 'OTHER');

-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('ACTIVE', 'REPAIR', 'FOR_SALE', 'DAMAGED');

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "EquipmentCategory" NOT NULL,
    "manufacturer" TEXT,
    "acquisitionDate" TIMESTAMP(3),
    "status" "EquipmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "diameterSensor" TEXT,
    "focalResolution" TEXT,
    "fdRatio" TEXT,
    "otherSpec" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Equipment_userId_idx" ON "Equipment"("userId");

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
