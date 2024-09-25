/*
  Warnings:

  - You are about to drop the column `userId` on the `UserProfiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userProfileId]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userProfileId` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserProfiles" DROP CONSTRAINT "UserProfiles_userId_fkey";

-- DropIndex
DROP INDEX "UserProfiles_userId_key";

-- AlterTable
ALTER TABLE "UserProfiles" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "userProfileId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_userProfileId_key" ON "Users"("userProfileId");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
