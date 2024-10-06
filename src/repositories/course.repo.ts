import { prisma } from "@/database/connect.db";
import { CreateCourseProps } from "@/types/course";
import { Course, Prisma } from "@prisma/client";

class CourseRepository {
  async create(data: CreateCourseProps, teacherId: string): Promise<Course> {
    // with or without categories
    const { name, description, categories } = data;
    return await prisma.course.create({
      data: {
        name,
        description,
        teacher: {
          connect: { id: teacherId },
        },
        ...(categories && categories.length > 0
          ? {
              categories: {
                create: categories.map((categoryName) => ({
                  category: {
                    connectOrCreate: {
                      where: { name: categoryName },
                      create: { name: categoryName },
                    },
                  },
                })),
              },
            }
          : {}),
      },
    });
  }

  async getOne(
    filter: Prisma.CourseWhereInput,
    options?: object,
  ): Promise<Course | null> {
    return await prisma.course.findFirst({
      where: filter,
      ...options,
    });
  }
  async getMany(
    filter: Prisma.CourseWhereInput,
    options?: object,
  ): Promise<Course[]> {
    return await prisma.course.findMany({
      where: filter,
      ...options,
    });
  }

  // async getManyByCategory();

  async update(
    filter: Prisma.CourseWhereUniqueInput,
    data: Prisma.CourseUpdateInput,
  ): Promise<Course> {
    return await prisma.course.update({
      where: filter,
      data,
    });
  }

  async delete(filter: Prisma.CourseWhereUniqueInput): Promise<Course> {
    return await prisma.course.delete({
      where: filter,
    });
  }

  /* -------------------------------- Enrollment -------------------------------- */
}

export default new CourseRepository();
