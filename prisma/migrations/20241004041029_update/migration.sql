/*
  Warnings:

  - The values [FINISHED,UNFINISHED] on the enum `SubmissionStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `cancelledAt` on the `Enrollments` table. All the data in the column will be lost.
  - The `status` column on the `Enrollments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('completed', 'inProgress');

-- AlterEnum
BEGIN;
CREATE TYPE "SubmissionStatus_new" AS ENUM ('finished', 'unfinished');
ALTER TABLE "QuizzSubmission" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "QuizzSubmission" ALTER COLUMN "status" TYPE "SubmissionStatus_new" USING ("status"::text::"SubmissionStatus_new");
ALTER TYPE "SubmissionStatus" RENAME TO "SubmissionStatus_old";
ALTER TYPE "SubmissionStatus_new" RENAME TO "SubmissionStatus";
DROP TYPE "SubmissionStatus_old";
ALTER TABLE "QuizzSubmission" ALTER COLUMN "status" SET DEFAULT 'unfinished';
COMMIT;

-- DropForeignKey
ALTER TABLE "Admins" DROP CONSTRAINT "Admins_userId_fkey";

-- DropForeignKey
ALTER TABLE "CategoriesOnCourses" DROP CONSTRAINT "CategoriesOnCourses_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoriesOnCourses" DROP CONSTRAINT "CategoriesOnCourses_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollments" DROP CONSTRAINT "Enrollments_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollments" DROP CONSTRAINT "Enrollments_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Lessons" DROP CONSTRAINT "Lessons_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "Modules" DROP CONSTRAINT "Modules_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Questions" DROP CONSTRAINT "Questions_quizzId_fkey";

-- DropForeignKey
ALTER TABLE "QuizzSubmission" DROP CONSTRAINT "QuizzSubmission_quizzId_fkey";

-- DropForeignKey
ALTER TABLE "QuizzSubmission" DROP CONSTRAINT "QuizzSubmission_studentId_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Quizzes" DROP CONSTRAINT "Quizzes_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "Students" DROP CONSTRAINT "Students_id_fkey";

-- DropForeignKey
ALTER TABLE "Teachers" DROP CONSTRAINT "Teachers_id_fkey";

-- DropForeignKey
ALTER TABLE "submissionAnswers" DROP CONSTRAINT "submissionAnswers_quizzSubmissionId_fkey";

-- AlterTable
ALTER TABLE "Enrollments" DROP COLUMN "cancelledAt",
ALTER COLUMN "grade" SET DEFAULT 0,
ALTER COLUMN "feedback" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "EnrollmentStatus" NOT NULL DEFAULT 'inProgress',
ALTER COLUMN "completion" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "QuizzSubmission" ALTER COLUMN "status" SET DEFAULT 'unfinished';

-- DropEnum
DROP TYPE "QuestionType";

-- AddForeignKey
ALTER TABLE "Admins" ADD CONSTRAINT "Admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnCourses" ADD CONSTRAINT "CategoriesOnCourses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnCourses" ADD CONSTRAINT "CategoriesOnCourses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Modules" ADD CONSTRAINT "Modules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lessons" ADD CONSTRAINT "Lessons_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quizzes" ADD CONSTRAINT "Quizzes_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_quizzId_fkey" FOREIGN KEY ("quizzId") REFERENCES "Quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_id_fkey" FOREIGN KEY ("id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizzSubmission" ADD CONSTRAINT "QuizzSubmission_quizzId_fkey" FOREIGN KEY ("quizzId") REFERENCES "Quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizzSubmission" ADD CONSTRAINT "QuizzSubmission_studentId_courseId_fkey" FOREIGN KEY ("studentId", "courseId") REFERENCES "Enrollments"("studentId", "courseId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissionAnswers" ADD CONSTRAINT "submissionAnswers_quizzSubmissionId_fkey" FOREIGN KEY ("quizzSubmissionId") REFERENCES "QuizzSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teachers" ADD CONSTRAINT "Teachers_id_fkey" FOREIGN KEY ("id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
