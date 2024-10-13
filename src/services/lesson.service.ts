import { CustomError } from "@/configs";
import courseRepo from "@/repositories/course.repo";
import lessonRepo from "@/repositories/lesson.repo";
import moduleRepo from "@/repositories/module.repo";
import {
  CreateLessonProps,
  GetLessonsProp,
  UpadteLessonProps,
} from "@/types/lesson";
import { Lesson, Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

class LessonService {
  private section = LessonService.name;
  createLesson = async (data: CreateLessonProps, teacherId: string) => {
    const { moduleId } = data;
    const module = await moduleRepo.getOne({ id: moduleId });
    if (!module) {
      throw new CustomError(
        "Module not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    const course = await courseRepo.getOne({ id: module.courseId });

    if (!course) {
      throw new CustomError(
        "Course not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    if (course && teacherId !== course.teacherId) {
      throw new CustomError(
        "Course not belong to teacher",
        StatusCodes.CONFLICT,
        this.section,
      );
    }
    return await lessonRepo.create(data);
  };

  getLesson = async (filter: Prisma.LessonWhereInput) => {
    const { id, slug } = filter;
    const lesson = await lessonRepo.getOne({
      OR: [
        {
          slug,
        },
        {
          id,
        },
      ],
    });
    if (!lesson) {
      throw new CustomError(
        "Lesson not found",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    return lesson;
  };

  getLessons = async (filter: GetLessonsProp) => {
    const lessons = await lessonRepo.getMany(filter);
    return lessons;
  };

  updateLesson = async (
    filter: Prisma.LessonWhereUniqueInput,
    data: UpadteLessonProps,
    teacherId: string,
  ) => {
    const lesson = await lessonRepo.getOne(filter);
    if (!lesson) {
      throw new CustomError(
        "Lesson not found",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    const module = await moduleRepo.getOne({ id: lesson.moduleId });
    if (!module) {
      throw new CustomError(
        "Module not found",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    const course = await courseRepo.getOne({ id: module.courseId });
    if (!course) {
      throw new CustomError(
        "Course not found",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    if (course && teacherId !== course.teacherId) {
      throw new CustomError(
        "Course not belong to teacher",
        StatusCodes.CONFLICT,
        this.section,
      );
    }
    return await lessonRepo.update(filter, data);
  };

  deleteLesson = async (filter: Pick<Lesson, "id">, teacherId: string) => {
    const lesson = await lessonRepo.getOne(filter);
    if (!lesson) {
      throw new CustomError(
        "Lesson not found",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    const module = await moduleRepo.getOne({ id: lesson.moduleId });
    if (!module) {
      throw new CustomError(
        "Module not found",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    const course = await courseRepo.getOne({ id: module.courseId });
    if (!course) {
      throw new CustomError(
        "Course not found",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    if (course && teacherId !== course.teacherId) {
      throw new CustomError(
        "Course not belong to teacher",
        StatusCodes.CONFLICT,
        this.section,
      );
    }
    const deletedlesson = await lessonRepo.delete(filter);
    const lessonsBehind = await lessonRepo.getMany(
      {
        moduleId: deletedlesson.moduleId,
        position: {
          gt: deletedlesson.position,
        },
      },
      {
        orderBy: {
          position: "asc",
        },
      },
    );
    lessonsBehind.forEach(async (lesson) => {
      await lessonRepo.update(
        { id: lesson.id },
        {
          position: lesson.position - 1,
        },
      );
    });
    return deletedlesson;
  };
}

export default new LessonService();
