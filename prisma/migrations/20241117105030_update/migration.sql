/*
  Warnings:

  - The values [finished,unfinished,late] on the enum `SubmissionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubmissionStatus_new" AS ENUM ('UNFINISHED', 'COMPLETED');
ALTER TABLE "QuizzSubmission" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "QuizzSubmission" ALTER COLUMN "status" TYPE "SubmissionStatus_new" USING ("status"::text::"SubmissionStatus_new");
ALTER TYPE "SubmissionStatus" RENAME TO "SubmissionStatus_old";
ALTER TYPE "SubmissionStatus_new" RENAME TO "SubmissionStatus";
DROP TYPE "SubmissionStatus_old";
ALTER TABLE "QuizzSubmission" ALTER COLUMN "status" SET DEFAULT 'UNFINISHED';
COMMIT;

-- AlterTable
ALTER TABLE "QuizzSubmission" ALTER COLUMN "status" SET DEFAULT 'UNFINISHED';
