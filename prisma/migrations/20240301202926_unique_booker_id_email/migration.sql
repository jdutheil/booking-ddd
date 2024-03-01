/*
  Warnings:

  - A unique constraint covering the columns `[bookerId,email]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Contact_bookerId_email_key" ON "Contact"("bookerId", "email");
