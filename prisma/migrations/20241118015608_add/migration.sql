/*
  Warnings:

  - You are about to drop the column `submissionResponses` on the `QuizzSubmission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QuizzSubmission" DROP COLUMN "submissionResponses",
ADD COLUMN     "submissionEvaluations" JSONB[];
