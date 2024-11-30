/*
  Warnings:

  - You are about to drop the `submissionAnswers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dueAt` to the `QuizzSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "SubmissionStatus" ADD VALUE 'late';

-- DropForeignKey
ALTER TABLE "submissionAnswers" DROP CONSTRAINT "submissionAnswers_quizzSubmissionId_fkey";

-- AlterTable
ALTER TABLE "QuizzSubmission" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dueAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "submissionAnswers" JSONB[],
ALTER COLUMN "score" SET DEFAULT 0,
ALTER COLUMN "submittedAt" DROP NOT NULL,
ALTER COLUMN "submittedAt" DROP DEFAULT;

-- DropTable
DROP TABLE "submissionAnswers";
