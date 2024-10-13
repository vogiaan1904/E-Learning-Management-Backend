import { prisma } from "@/database/connect.db";
import { CreateLessonProps } from "@/types/lesson";
import { Lesson, Prisma } from "@prisma/client";
import slugify from "slugify";

class LessonRepository {
  async create(data: CreateLessonProps): Promise<Lesson> {
    const { name, description, position, moduleId, content } = data;
    const slug = slugify(name, { lower: true });

    return await prisma.lesson.create({
      data: {
        name,
        slug,
        content: content as Prisma.InputJsonValue,
        description,
        position,
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
