import { prisma } from "@/database/connect.db";
import { Prisma, Teacher } from "@prisma/client";

class TeacherRepository {
  async getOne(
    filter: Prisma.TeacherWhereInput,
    options?: object,
  ): Promise<Teacher | null> {
    return await prisma.teacher.findFirst({
      where: filter,
      ...options,
    });
  }
}

export default new TeacherRepository();
