import { prisma } from "@/database/connect.db";
import { Prisma } from "@prisma/client";

class StudentRepository {
  getOne = async (filter: Prisma.StudentWhereInput, options?: object) => {
    const student = await prisma.student.findFirst({
      where: filter,
      ...options,
    });
    return student;
  };
}

export default new StudentRepository();
