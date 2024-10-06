/*
  Warnings:

  - The values [completed,inProgress,cancelled] on the enum `EnrollmentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EnrollmentStatus_new" AS ENUM ('COMPLETED', 'IN_PROGRESS', 'CANCELLED');
ALTER TABLE "Enrollments" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Enrollments" ALTER COLUMN "status" TYPE "EnrollmentStatus_new" USING ("status"::text::"EnrollmentStatus_new");
ALTER TYPE "EnrollmentStatus" RENAME TO "EnrollmentStatus_old";
ALTER TYPE "EnrollmentStatus_new" RENAME TO "EnrollmentStatus";
DROP TYPE "EnrollmentStatus_old";
ALTER TABLE "Enrollments" ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS';
COMMIT;

-- AlterTable
ALTER TABLE "Enrollments" ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS';
