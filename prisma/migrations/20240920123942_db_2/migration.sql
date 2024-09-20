/*
  Warnings:

  - Added the required column `avatar` to the `UserProfiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserProfiles" ADD COLUMN     "avatar" TEXT NOT NULL;
