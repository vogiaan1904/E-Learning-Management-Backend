-- AlterTable
ALTER TABLE "Enrollments" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "isCancelled" BOOLEAN NOT NULL DEFAULT false;
