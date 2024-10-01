-- AlterTable
ALTER TABLE "Courses" ALTER COLUMN "isPublic" SET DEFAULT true,
ALTER COLUMN "numEnrollments" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "Admins" (
    "userId" TEXT NOT NULL,
    "field" TEXT,

    CONSTRAINT "Admins_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Admins" ADD CONSTRAINT "Admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
