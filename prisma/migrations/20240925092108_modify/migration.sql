-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('VIDEO', 'BLOG');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MUTIPLE_CHOICE', 'TEXT');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('FINISHED', 'UNFINISHED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'teacher', 'admin');

-- CreateTable
CREATE TABLE "Courses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL,
    "numEnrollments" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseCategories" (
    "id" TEXT NOT NULL,
    "categoryType" TEXT NOT NULL,

    CONSTRAINT "CourseCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseToCategories" (
    "courseId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "CourseToCategories_pkey" PRIMARY KEY ("courseId","categoryId")
);

-- CreateTable
CREATE TABLE "Modules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "numLessons" INTEGER NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lessons" (
    "id" TEXT NOT NULL,
    "name" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "content" JSONB NOT NULL,

    CONSTRAINT "Lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quizzes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "timeLimit" INTEGER NOT NULL,
    "moduleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Questions" (
    "id" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "quizzId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShortAnswerQuestions" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "wordLimit" INTEGER NOT NULL,

    CONSTRAINT "ShortAnswerQuestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MultipleChoiceQuestions" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correctOption" JSONB NOT NULL,

    CONSTRAINT "MultipleChoiceQuestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Students" (
    "userId" TEXT NOT NULL,

    CONSTRAINT "Students_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Enrollments" (
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "feedback" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "completion" INTEGER NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelledAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enrollments_pkey" PRIMARY KEY ("studentId","courseId")
);

-- CreateTable
CREATE TABLE "QuizzSubmission" (
    "id" TEXT NOT NULL,
    "quizzId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'UNFINISHED',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizzSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissionAnswers" (
    "id" TEXT NOT NULL,
    "quizzSubmissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submissionAnswers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teachers" (
    "userId" TEXT NOT NULL,
    "field" TEXT NOT NULL,

    CONSTRAINT "Teachers_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birth" TIMESTAMP(3),
    "gender" "Gender" NOT NULL DEFAULT 'CUSTOM',
    "avatar" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProfiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserVerifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiredAt" TIMESTAMP(3),

    CONSTRAINT "UserVerifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShortAnswerQuestions_questionId_key" ON "ShortAnswerQuestions"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "MultipleChoiceQuestions_questionId_key" ON "MultipleChoiceQuestions"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE INDEX "Users_email_username_deletedAt_idx" ON "Users"("email", "username", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfiles_userId_key" ON "UserProfiles"("userId");

-- AddForeignKey
ALTER TABLE "Courses" ADD CONSTRAINT "Courses_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teachers"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseToCategories" ADD CONSTRAINT "CourseToCategories_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseToCategories" ADD CONSTRAINT "CourseToCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CourseCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Modules" ADD CONSTRAINT "Modules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lessons" ADD CONSTRAINT "Lessons_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quizzes" ADD CONSTRAINT "Quizzes_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_quizzId_fkey" FOREIGN KEY ("quizzId") REFERENCES "Quizzes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortAnswerQuestions" ADD CONSTRAINT "ShortAnswerQuestions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultipleChoiceQuestions" ADD CONSTRAINT "MultipleChoiceQuestions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Students"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizzSubmission" ADD CONSTRAINT "QuizzSubmission_quizzId_fkey" FOREIGN KEY ("quizzId") REFERENCES "Quizzes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizzSubmission" ADD CONSTRAINT "QuizzSubmission_studentId_courseId_fkey" FOREIGN KEY ("studentId", "courseId") REFERENCES "Enrollments"("studentId", "courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissionAnswers" ADD CONSTRAINT "submissionAnswers_quizzSubmissionId_fkey" FOREIGN KEY ("quizzSubmissionId") REFERENCES "QuizzSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teachers" ADD CONSTRAINT "Teachers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfiles" ADD CONSTRAINT "UserProfiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVerifications" ADD CONSTRAINT "UserVerifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
