-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_profileId_fkey";

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "UserProfiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
