import { prisma } from "@/database/connect.db";
import { CreateModuleProps } from "@/types/module";
import { Module, Prisma } from "@prisma/client";

class ModuleRepository {
  async create(data: CreateModuleProps): Promise<Module> {
    const { name, description, position, courseId } = data;
    return await prisma.module.create({
      data: {
        name,
        description,
        position,
        course: {
          connect: { id: courseId },
        },
      },
    });
  }

  async getOne(
    filter: Prisma.ModuleWhereInput,
    options?: object,
  ): Promise<Module | null> {
    return await prisma.module.findFirst({
      where: filter,
      ...options,
    });
  }

  async getMany(
    filter: Prisma.ModuleWhereInput,
    options?: object,
  ): Promise<Module[]> {
    return await prisma.module.findMany({
      where: filter,
      ...options,
    });
  }
  async update(
    filter: Prisma.ModuleWhereUniqueInput,
    data: Prisma.ModuleUpdateInput,
  ): Promise<Module> {
    return await prisma.module.update({
      where: filter,
      data: data,
    });
  }
  async delete(filter: Prisma.ModuleWhereUniqueInput): Promise<Module> {
    return await prisma.module.delete({
      where: filter,
    });
  }
}

export default new ModuleRepository();
