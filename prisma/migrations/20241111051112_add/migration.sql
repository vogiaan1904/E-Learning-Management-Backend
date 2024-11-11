-- DropForeignKey
ALTER TABLE "UserVerifications" DROP CONSTRAINT "UserVerifications_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserVerifications" ADD CONSTRAINT "UserVerifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
