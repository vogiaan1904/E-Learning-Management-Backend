/*
  Warnings:

  - You are about to drop the column `index` on the `Questions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[moduleId,position]` on the table `Lessons` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[courseId,position]` on the table `Modules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[position,quizzId]` on the table `Questions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[position,moduleId]` on the table `Quizzes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `position` to the `Lessons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `Modules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `Questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `Quizzes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Enrollments" ADD COLUMN     "completedLessonsIds" TEXT[],
ADD COLUMN     "completedModulesIds" TEXT[],
ADD COLUMN     "lessonsCompleted" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "modulesCompleted" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Lessons" ADD COLUMN     "position" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Modules" ADD COLUMN     "position" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Questions" DROP COLUMN "index",
ADD COLUMN     "position" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Quizzes" ADD COLUMN     "position" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Lessons_moduleId_position_key" ON "Lessons"("moduleId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Modules_courseId_position_key" ON "Modules"("courseId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Questions_position_quizzId_key" ON "Questions"("position", "quizzId");

-- CreateIndex
CREATE UNIQUE INDEX "Quizzes_position_moduleId_key" ON "Quizzes"("position", "moduleId");
