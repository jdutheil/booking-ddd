/*
  Warnings:

  - You are about to drop the column `hashedPassword` on the `Booker` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booker" DROP COLUMN "hashedPassword";

-- CreateTable
CREATE TABLE "Authentication" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "bookerId" TEXT NOT NULL,

    CONSTRAINT "Authentication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Authentication_email_key" ON "Authentication"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Authentication_bookerId_key" ON "Authentication"("bookerId");

-- AddForeignKey
ALTER TABLE "Authentication" ADD CONSTRAINT "Authentication_bookerId_fkey" FOREIGN KEY ("bookerId") REFERENCES "Booker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
