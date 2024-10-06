/*
  Warnings:

  - The primary key for the `Enrollments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `courseId` on the `QuizzSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `QuizzSubmission` table. All the data in the column will be lost.
  - The required column `id` was added to the `Enrollments` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `enrollmentId` to the `QuizzSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "QuizzSubmission" DROP CONSTRAINT "QuizzSubmission_studentId_courseId_fkey";

-- AlterTable
ALTER TABLE "Enrollments" DROP CONSTRAINT "Enrollments_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Enrollments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "QuizzSubmission" DROP COLUMN "courseId",
DROP COLUMN "studentId",
ADD COLUMN     "enrollmentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "QuizzSubmission" ADD CONSTRAINT "QuizzSubmission_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
