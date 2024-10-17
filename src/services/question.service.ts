import quizzRepo from "@/repositories/quizz.repo";
import { CreateQuestionProps, UpdateQuestionProps } from "@/types/question";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "@/configs";
import courseRepo from "@/repositories/course.repo";
import moduleRepo from "@/repositories/module.repo";
import questionRepo from "@/repositories/question.repo";
import { Prisma } from "@prisma/client";

class QuestionService {
  private section = QuestionService.name;
  createQuestion = async (data: CreateQuestionProps, teacherId: string) => {
    const { quizzId } = data;
    const quiz = await quizzRepo.getOne({ id: quizzId });
    if (!quiz) {
      throw new CustomError(
        "Quiz not found.",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
    const module = await moduleRepo.getOne({ id: quiz.moduleId });
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
    if (teacherId !== course.teacherId) {
      throw new CustomError(
        "Course not belong to teacher",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
    const questions = await questionRepo.getMany({ quizzId });
    const position = questions.length;
    return await questionRepo.create(data, position);
  };
  getQuestion = async (filter: Prisma.QuestionWhereInput) => {
    const question = questionRepo.getOne(filter);
    if (!question) {
      throw new CustomError(
        "Question not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    return question;
  };
  updateQuestion = async (
    filter: Prisma.QuestionWhereUniqueInput,
    data: UpdateQuestionProps,
    teacherId: string,
  ) => {
    const question = await questionRepo.getOne(filter);
    if (!question) {
      throw new CustomError(
        "Question not found",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    const quiz = await quizzRepo.getOne({ id: question.quizzId });
    if (!quiz) {
      throw new CustomError(
        "Quiz not found.",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
    const module = await moduleRepo.getOne({ id: quiz.moduleId });
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
    if (teacherId !== course.teacherId) {
      throw new CustomError(
        "Course not belong to teacher",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
    return await questionRepo.update(filter, data);
  };
  deleteQuestion = async (
    filter: Prisma.QuestionWhereUniqueInput,
    teacherId: string,
  ) => {
    const question = await questionRepo.getOne(filter);
    if (!question) {
      throw new CustomError(
        "Question not found",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    const quiz = await quizzRepo.getOne({ id: question.quizzId });
    if (!quiz) {
      throw new CustomError(
        "Quiz not found.",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
    const module = await moduleRepo.getOne({ id: quiz.moduleId });
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
    if (teacherId !== course.teacherId) {
      throw new CustomError(
        "Course not belong to teacher",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
    return await questionRepo.delete(filter);
  };
}
export default new QuestionService();
