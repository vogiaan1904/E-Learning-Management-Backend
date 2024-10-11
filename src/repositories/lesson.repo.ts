import { prisma } from "@/database/connect.db";
import { CreateLessonProps } from "@/types/lesson";
import { Lesson, Prisma } from "@prisma/client";

class LessonRepository {
  async create(data: CreateLessonProps, moduleId: string): Promise<Lesson> {
    const { name, description, position, content } = data;
    return await prisma.lesson.create({
      data: {
        name,
        description,
        position,
        content: content as Prisma.JsonObject,
        module: {
          connect: { id: moduleId },
        },
      },
    });
  }
  async getOne(
    filter: Prisma.LessonWhereInput,
    options?: object,
  ): Promise<Lesson | null> {
    return await prisma.lesson.findFirst({
      where: filter,
      ...options,
    });
  }
  async getMany(
    filter: Prisma.LessonWhereInput,
    options?: object,
  ): Promise<Lesson[]> {
    return await prisma.lesson.findMany({
      where: filter,
      ...options,
    });
  }
  async update(
    filter: Prisma.LessonWhereUniqueInput,
    data: Prisma.LessonUpdateInput,
  ): Promise<Lesson> {
    return await prisma.lesson.update({
      where: filter,
      data: data,
    });
  }
  async delete(filter: Prisma.LessonWhereUniqueInput): Promise<Lesson> {
    return await prisma.lesson.delete({
      where: filter,
    });
  }
}
export default new LessonRepository();
