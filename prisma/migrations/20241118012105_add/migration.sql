/*
  Warnings:

  - You are about to drop the column `result` on the `QuizzSubmission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QuizzSubmission" DROP COLUMN "result",
ADD COLUMN     "submissionResponses" JSONB[];
