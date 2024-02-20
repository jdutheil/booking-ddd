/*
  Warnings:

  - You are about to drop the column `userId` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bookerId` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_userId_fkey";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "userId",
ADD COLUMN     "bookerId" TEXT NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Booker" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,

    CONSTRAINT "Booker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Booker_email_key" ON "Booker"("email");

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_bookerId_fkey" FOREIGN KEY ("bookerId") REFERENCES "Booker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
