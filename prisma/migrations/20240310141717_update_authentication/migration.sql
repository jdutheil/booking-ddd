/*
  Warnings:

  - You are about to drop the column `accessToken` on the `Authentication` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Authentication` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Authentication` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `Authentication` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Authentication` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Authentication_email_key";

-- AlterTable
ALTER TABLE "Authentication" DROP COLUMN "accessToken",
DROP COLUMN "email",
DROP COLUMN "password",
DROP COLUMN "refreshToken",
ADD COLUMN     "userId" TEXT NOT NULL;
