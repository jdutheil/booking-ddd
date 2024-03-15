-- CreateEnum
CREATE TYPE "OrganizerType" AS ENUM ('CITY_HALL', 'TOURIST_OFFICE', 'ASSOCIATION', 'OTHER');

-- AlterTable
ALTER TABLE "Organizer" ADD COLUMN     "type" "OrganizerType" NOT NULL DEFAULT 'OTHER';

-- CreateTable
CREATE TABLE "OrganizerEmail" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "organizerId" TEXT NOT NULL,

    CONSTRAINT "OrganizerEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizerPhone" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "organizerId" TEXT NOT NULL,

    CONSTRAINT "OrganizerPhone_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrganizerEmail" ADD CONSTRAINT "OrganizerEmail_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizerPhone" ADD CONSTRAINT "OrganizerPhone_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
