/*
  Warnings:

  - Made the column `content` on table `Lessons` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Lessons" ALTER COLUMN "content" SET NOT NULL;
