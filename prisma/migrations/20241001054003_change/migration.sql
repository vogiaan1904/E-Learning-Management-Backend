/*
  Warnings:

  - You are about to drop the `CourseToCategories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CourseToCategories" DROP CONSTRAINT "CourseToCategories_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CourseToCategories" DROP CONSTRAINT "CourseToCategories_courseId_fkey";

-- DropTable
DROP TABLE "CourseToCategories";

-- CreateTable
CREATE TABLE "CategoriesOnCourses" (
    "courseId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "CategoriesOnCourses_pkey" PRIMARY KEY ("courseId","categoryId")
);

-- AddForeignKey
ALTER TABLE "CategoriesOnCourses" ADD CONSTRAINT "CategoriesOnCourses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnCourses" ADD CONSTRAINT "CategoriesOnCourses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
