/*
  Warnings:

  - You are about to drop the column `score` on the `Questions` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Quizzes` table. All the data in the column will be lost.
  - You are about to drop the `MultipleChoiceQuestions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShortAnswerQuestions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `correctOption` to the `Questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wrongOptions` to the `Questions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MultipleChoiceQuestions" DROP CONSTRAINT "MultipleChoiceQuestions_questionId_fkey";

-- DropForeignKey
ALTER TABLE "ShortAnswerQuestions" DROP CONSTRAINT "ShortAnswerQuestions_questionId_fkey";

-- AlterTable
ALTER TABLE "Modules" ALTER COLUMN "numLessons" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Questions" DROP COLUMN "score",
ADD COLUMN     "correctOption" JSONB NOT NULL,
ADD COLUMN     "wrongOptions" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Quizzes" DROP COLUMN "score";

-- DropTable
DROP TABLE "MultipleChoiceQuestions";

-- DropTable
DROP TABLE "ShortAnswerQuestions";
