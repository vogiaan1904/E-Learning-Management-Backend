/*
  Warnings:

  - The primary key for the `Enrollments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `studentId` on the `Enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `QuizzSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserProfiles` table. All the data in the column will be lost.
  - The `role` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `CourseToCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Students` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teachers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `studentCourseDetails` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[profileId]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Enrollments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `QuizzSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CourseToCategory" DROP CONSTRAINT "CourseToCategory_categoryType_fkey";

-- DropForeignKey
ALTER TABLE "CourseToCategory" DROP CONSTRAINT "CourseToCategory_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollments" DROP CONSTRAINT "Enrollments_studentId_fkey";

-- DropForeignKey
ALTER TABLE "QuizzSubmission" DROP CONSTRAINT "QuizzSubmission_studentId_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Students" DROP CONSTRAINT "Students_userId_fkey";

-- DropForeignKey
ALTER TABLE "Teachers" DROP CONSTRAINT "Teachers_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserProfiles" DROP CONSTRAINT "UserProfiles_userId_fkey";

-- DropForeignKey
ALTER TABLE "studentCourseDetails" DROP CONSTRAINT "studentCourseDetails_studentId_courseId_fkey";

-- DropIndex
DROP INDEX "UserProfiles_userId_key";

-- AlterTable
ALTER TABLE "Enrollments" DROP CONSTRAINT "Enrollments_pkey",
DROP COLUMN "studentId",
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "Enrollments_pkey" PRIMARY KEY ("userId", "courseId");

-- AlterTable
ALTER TABLE "QuizzSubmission" DROP COLUMN "studentId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserProfiles" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';

-- DropTable
DROP TABLE "CourseToCategory";

-- DropTable
DROP TABLE "Students";

-- DropTable
DROP TABLE "Teachers";

-- DropTable
DROP TABLE "studentCourseDetails";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "CourseToCategories" (
    "courseId" TEXT NOT NULL,
    "categoryType" TEXT NOT NULL,

    CONSTRAINT "CourseToCategories_pkey" PRIMARY KEY ("courseId","categoryType")
);

-- CreateTable
CREATE TABLE "StudentCourseDetails" (
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "feedback" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "completion" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentCourseDetails_pkey" PRIMARY KEY ("userId","courseId")
);

-- CreateTable
CREATE TABLE "CourseInvolvements" (
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CourseInvolvements_pkey" PRIMARY KEY ("userId","courseId")
);

-- CreateTable
CREATE TABLE "UserTokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiredAt" TIMESTAMP(3),

    CONSTRAINT "UserTokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_profileId_key" ON "Users"("profileId");

-- AddForeignKey
ALTER TABLE "CourseToCategories" ADD CONSTRAINT "CourseToCategories_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseToCategories" ADD CONSTRAINT "CourseToCategories_categoryType_fkey" FOREIGN KEY ("categoryType") REFERENCES "CourseCategories"("categoryType") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCourseDetails" ADD CONSTRAINT "StudentCourseDetails_userId_courseId_fkey" FOREIGN KEY ("userId", "courseId") REFERENCES "Enrollments"("userId", "courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizzSubmission" ADD CONSTRAINT "QuizzSubmission_userId_courseId_fkey" FOREIGN KEY ("userId", "courseId") REFERENCES "Enrollments"("userId", "courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseInvolvements" ADD CONSTRAINT "CourseInvolvements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseInvolvements" ADD CONSTRAINT "CourseInvolvements_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "UserProfiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTokens" ADD CONSTRAINT "UserTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
