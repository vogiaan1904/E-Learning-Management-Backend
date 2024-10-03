/*
  Warnings:

  - You are about to drop the `CourseCategories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CourseToCategories" DROP CONSTRAINT "CourseToCategories_categoryId_fkey";

-- DropTable
DROP TABLE "CourseCategories";

-- CreateTable
CREATE TABLE "Categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CourseToCategories" ADD CONSTRAINT "CourseToCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
