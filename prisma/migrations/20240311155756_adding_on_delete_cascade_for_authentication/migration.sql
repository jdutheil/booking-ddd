-- DropForeignKey
ALTER TABLE "Authentication" DROP CONSTRAINT "Authentication_bookerId_fkey";

-- AddForeignKey
ALTER TABLE "Authentication" ADD CONSTRAINT "Authentication_bookerId_fkey" FOREIGN KEY ("bookerId") REFERENCES "Booker"("id") ON DELETE CASCADE ON UPDATE CASCADE;
