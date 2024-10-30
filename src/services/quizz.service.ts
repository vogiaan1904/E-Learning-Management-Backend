import { CustomError } from "@/configs";
import courseRepo from "@/repositories/course.repo";
import moduleRepo from "@/repositories/module.repo";
import quizzRepo from "@/repositories/quizz.repo";
import {
  CreateQuizzProps,
  GetQuizzesProp,
  UpdateQuizzProps,
} from "@/types/quizz";
import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

class QuizzService {
  private section = QuizzService.name;
  private getCourseByModuleId = async (moduleId: string) => {
    const module = await moduleRepo.getOne({ id: moduleId });
    if (!module) {
      throw new CustomError(
        "Module not found.",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
    const course = await courseRepo.getOne({ id: module.courseId });
    if (!course) {
      throw new CustomError(
        "Coursse not found.",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
    return course;
  };
  createQuizz = async (data: CreateQuizzProps, teacherId: string) => {
    const { moduleId } = data;

    const course = await this.getCourseByModuleId(moduleId);

    if (course && teacherId !== course.teacherId) {
      throw new CustomError(
        "Course not belong to teacher",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
    const numQuizzes = await quizzRepo.getMany({ moduleId });

    const position = numQuizzes.length;

    const quizz = await quizzRepo.create(data, position);
    console.log("quizz created successfully");
    return quizz;
  };

  getQuizz = async (filter: Prisma.QuizzWhereInput) => {
    const quizz = await quizzRepo.getOne(filter, {
      include: {
        questions: true,
      },
    });
    if (!quizz) {
      throw new CustomError(
        "Quizz not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    return quizz;
  };
  getQuizzes = async (filter: GetQuizzesProp) => {
    const quizzes = await quizzRepo.getMany(filter);
    return quizzes;
  };

  updateQuizz = async (
    filter: Prisma.QuizzWhereUniqueInput,
    data: UpdateQuizzProps,
    teacherId: string,
  ) => {
    const quizz = await quizzRepo.getOne(filter);
    if (!quizz) {
      throw new CustomError(
        "Quizz not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    const course = await this.getCourseByModuleId(quizz.moduleId);

    if (course && teacherId !== course.teacherId) {
      throw new CustomError(
        "Course not belong to teacher",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
    return await quizzRepo.update(filter, data);
  };

  deleteQuizz = async (
    filter: Prisma.QuizzWhereUniqueInput,
    teacherId: string,
  ) => {
    const quizz = await quizzRepo.getOne(filter);
    if (!quizz) {
      throw new CustomError(
        "Quizz not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    const module = await moduleRepo.getOne({ id: quizz.moduleId });
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
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
    return await quizzRepo.delete(filter);
  };
}

export default new QuizzService();
