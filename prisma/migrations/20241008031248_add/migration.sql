/*
  Warnings:

  - You are about to drop the column `lessonsCompleted` on the `Enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `modulesCompleted` on the `Enrollments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Enrollments" DROP COLUMN "lessonsCompleted",
DROP COLUMN "modulesCompleted";
