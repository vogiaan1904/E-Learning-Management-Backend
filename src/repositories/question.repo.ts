import { prisma } from "@/database/connect.db";
import { CreateQuestionProps, UpdateQuestionProps } from "@/types/question";
import { Prisma, Question } from "@prisma/client";

class QuestionRepository {
  async create(data: CreateQuestionProps, position: number): Promise<Question> {
    const { content, correctOption, wrongOptions, quizzId } = data;
    return await prisma.question.create({
      data: {
        content,
        correctOption: correctOption as Prisma.InputJsonValue,
        wrongOptions: wrongOptions as Prisma.InputJsonValue,
        position,
        quizz: {
          connect: { id: quizzId },
        },
      },
    });
  }
  async getOne(
    filter: Prisma.QuestionWhereInput,
    options?: object,
  ): Promise<Question | null> {
    return await prisma.question.findFirst({
      where: filter,
      ...options,
    });
  }
  async getMany(
    filter: Prisma.QuestionWhereInput,
    options?: object,
  ): Promise<Question[]> {
    return await prisma.question.findMany({
      where: filter,
      ...options,
    });
  }
  async update(
    filter: Prisma.QuestionWhereUniqueInput,
    data: UpdateQuestionProps,
  ): Promise<Question> {
    return await prisma.question.update({
      where: filter,
      data,
    });
  }
  async delete(filter: Prisma.QuestionWhereUniqueInput): Promise<Question> {
    return await prisma.question.delete({
      where: filter,
    });
  }
}
export default new QuestionRepository();
