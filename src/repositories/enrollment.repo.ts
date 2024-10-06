import { prisma } from "@/database/connect.db";
import { CreateEnrollmentProps } from "@/types/enrollment";
import { Enrollment, Prisma } from "@prisma/client";

class EnrollmentRepository {
  async getOne(
    filter: Prisma.EnrollmentWhereInput,
    options?: object,
  ): Promise<Enrollment | null> {
    return await prisma.enrollment.findFirst({
      where: filter,
      ...options,
    });
  }

  async getMany(
    filter: Prisma.EnrollmentWhereInput,
    options?: object,
  ): Promise<Enrollment[]> {
    return await prisma.enrollment.findMany({
      where: filter,
      ...options,
    });
  }

  async create(data: CreateEnrollmentProps): Promise<Enrollment> {
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

  async update(
    filter: Prisma.EnrollmentWhereUniqueInput,
    data: Prisma.EnrollmentUpdateInput,
  ): Promise<Enrollment> {
    return await prisma.enrollment.update({
      where: filter,
      data: data,
    });
  }

  async delete(filter: Prisma.EnrollmentWhereUniqueInput): Promise<Enrollment> {
    return await prisma.enrollment.delete({
      where: filter,
    });
  }
}
export default new EnrollmentRepository();
