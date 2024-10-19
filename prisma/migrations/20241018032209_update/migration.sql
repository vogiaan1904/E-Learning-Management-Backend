/*
  Warnings:

  - You are about to drop the column `correctOption` on the `Questions` table. All the data in the column will be lost.
  - You are about to drop the column `wrongOptions` on the `Questions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Questions" DROP COLUMN "correctOption",
DROP COLUMN "wrongOptions",
ADD COLUMN     "options" JSONB[];
