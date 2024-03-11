-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "organizerId" TEXT;

-- CreateTable
CREATE TABLE "Organizer" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "bookerId" TEXT NOT NULL,

    CONSTRAINT "Organizer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Organizer" ADD CONSTRAINT "Organizer_bookerId_fkey" FOREIGN KEY ("bookerId") REFERENCES "Booker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
