/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Lessons` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Modules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Lessons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Modules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lessons" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Modules" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Lessons_slug_key" ON "Lessons"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Modules_slug_key" ON "Modules"("slug");
