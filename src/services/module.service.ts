import { CustomError } from "@/configs";
import courseRepo from "@/repositories/course.repo";
import moduleRepo from "@/repositories/module.repo";
import { CreateModuleProps, UpadteModuleProps } from "@/types/module";
import { StatusCodes } from "http-status-codes";
import { Prisma, Module } from "@prisma/client";
import lessonRepo from "@/repositories/lesson.repo";
import { GetModulesProps } from "@/types/module";
import { Course } from "@prisma/client";

class ModuleService {
  private section = ModuleService.name;
  createModule = async (
    data: CreateModuleProps,
    courseId: string,
    teacherId: string,
  ) => {
    const course = await courseRepo.getOne({ id: courseId });
    if (!course) {
      throw new CustomError(
        "Course not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    if (course.teacherId !== teacherId) {
      throw new CustomError(
        "Course not belong to teacher.",
        StatusCodes.CONFLICT,
        this.section,
      );
    }
    return await moduleRepo.create(data, courseId);
  };

  getModule = async (filter: Prisma.ModuleWhereInput, options?: object) => {
    const { name, id } = filter;
    const module = await moduleRepo.getOne(
      {
        OR: [
          {
            name: name,
          },
          {
            id: id,
          },
        ],
      },
      options,
    );
    if (!module) {
      throw new CustomError(
        "Module not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    const lessons = await lessonRepo.getMany(
      { moduleId: module.id },
      { orderBy: { position: "asc" } },
    );
    const lessonIds = lessons.map((lesson) => lesson.id);
    return { module, lessonIds };
  };

  getModules = async (filter: GetModulesProps) => {
    const modules = await moduleRepo.getMany(filter);
    return modules;
  };

  updateModule = async (
    filter: Pick<Module, "id">,
    data: UpadteModuleProps,
    teacherId: string,
  ) => {
    const module = await moduleRepo.getOne(filter);
    if (!module) {
      throw new CustomError(
        "Module not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    const course = (await courseRepo.getOne({
      id: module.courseId,
    })) as Course;

    if (teacherId !== course.teacherId) {
      throw new CustomError(
        "Module not belong to teacher.",
        StatusCodes.CONFLICT,
        this.section,
      );
    }
    return await moduleRepo.update(filter, data);
  };

  deleteModule = async (filter: Pick<Module, "id">, teacherId: string) => {
    const module = await moduleRepo.getOne(filter);
    if (!module) {
      throw new CustomError(
        "Module not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    const course = (await courseRepo.getOne({
      id: module.courseId,
    })) as Course;

    if (teacherId !== course.teacherId) {
      throw new CustomError(
        "Module not belong to teacher.",
        StatusCodes.CONFLICT,
        this.section,
      );
    }
    const deletedModule = await moduleRepo.delete(filter);
    const modulesBehind = await moduleRepo.getMany(
      {
        courseId: deletedModule.courseId,
        position: {
          gt: deletedModule.position,
        },
      },
      {
        orderBy: {
          position: "asc",
        },
      },
    );
    modulesBehind.forEach(async (module) => {
      await moduleRepo.update(
        { id: module.id },
        {
          position: module.position - 1,
        },
      );
    });
    return deletedModule;
  };
}

export default new ModuleService();
