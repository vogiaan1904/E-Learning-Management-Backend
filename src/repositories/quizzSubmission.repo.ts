import { prisma } from "@/database/connect.db";
import { CreateQuizzSubmissionProps } from "@/types/quizzSubmission";
import { Prisma, QuizzSubmission } from "@prisma/client";
class QuizzRepository {
  async create(data: CreateQuizzSubmissionProps): Promise<QuizzSubmission> {
    const { quizzId, enrollmentId, dueAt } = data;
    return await prisma.quizzSubmission.create({
      data: {
        quizz: {
          connect: {
            id: quizzId,
          },
        },
        enrollment: {
          connect: {
            id: enrollmentId,
          },
        },
        dueAt: dueAt,
      },
    });
  }

  async getOne(
    filter: Prisma.QuizzSubmissionWhereInput,
    options?: object,
  ): Promise<QuizzSubmission | null> {
    return await prisma.quizzSubmission.findFirst({
      where: filter,
      ...options,
    });
  }
  async getMany(
    filter: Prisma.QuizzSubmissionWhereInput,
    options?: object,
  ): Promise<QuizzSubmission[]> {
    return await prisma.quizzSubmission.findMany({
      where: filter,
      ...options,
    });
  }
  async update(
    filter: Prisma.QuizzSubmissionWhereUniqueInput,
    data: Partial<Prisma.QuizzSubmissionUpdateInput>,
  ): Promise<QuizzSubmission> {
    return await prisma.quizzSubmission.update({
      where: filter,
      data: data,
    });
  }
  async delete(
    filter: Prisma.QuizzSubmissionWhereUniqueInput,
  ): Promise<QuizzSubmission> {
    return await prisma.quizzSubmission.delete({
      where: filter,
    });
  }
}

export default new QuizzRepository();
