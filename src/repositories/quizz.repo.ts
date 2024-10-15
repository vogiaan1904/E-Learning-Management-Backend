import { prisma } from "@/database/connect.db";
import { CreateQuizzProps } from "@/types/quizz";
import { Prisma, Quizz } from "@prisma/client";

class QuizzRepository {
  async create(data: CreateQuizzProps, position: number): Promise<Quizz> {
    const { name, moduleId, description, timeLimit } = data;
    return await prisma.quizz.create({
      data: {
        name,
        description,
        position,
        timeLimit,
        module: {
          connect: { id: moduleId },
        },
      },
    });
  }

  async getOne(
    filter: Prisma.QuizzWhereInput,
    options?: object,
  ): Promise<Quizz | null> {
    return await prisma.quizz.findFirst({
      where: filter,
      ...options,
    });
  }

  async getMany(
    filter: Prisma.QuizzWhereInput,
    options?: object,
  ): Promise<Quizz[]> {
    return await prisma.quizz.findMany({
      where: filter,
      ...options,
    });
  }

  async update(
    filter: Prisma.QuizzWhereUniqueInput,
    data: Prisma.QuizzUpdateInput,
  ): Promise<Quizz | null> {
    return await prisma.quizz.update({
      where: filter,
      data: data,
    });
  }

  async delete(filter: Prisma.QuizzWhereUniqueInput): Promise<Quizz | null> {
    return await prisma.quizz.delete({
      where: filter,
    });
  }
}

export default new QuizzRepository();
