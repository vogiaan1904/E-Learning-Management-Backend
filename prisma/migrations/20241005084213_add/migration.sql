/*
  Warnings:

  - A unique constraint covering the columns `[studentId,courseId]` on the table `Enrollments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Enrollments_studentId_courseId_key" ON "Enrollments"("studentId", "courseId");
