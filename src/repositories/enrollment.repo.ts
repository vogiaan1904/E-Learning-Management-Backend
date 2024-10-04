import { prisma } from "@/database/connect.db";
import { CreateEnrollmentProps } from "@/types/course";
import { Enrollment, Prisma } from "@prisma/client";

class EnrollmentRepository {
  async getOne(
    filter: Prisma.EnrollmentWhereInput,
  ): Promise<Enrollment | null> {
    const { courseId, studentId } = filter;
    return await prisma.enrollment.findFirst({
      where: {
        courseId: courseId,
        studentId: studentId,
      },
    });
  }

  async enroll(data: CreateEnrollmentProps): Promise<Enrollment> {
    const { courseId, studentId } = data;
    return await prisma.enrollment.create({
      data: {
        student: {
          connect: { id: studentId },
        },
        course: {
          connect: { id: courseId },
        },
      },
    });
  }
}
export default new EnrollmentRepository();
