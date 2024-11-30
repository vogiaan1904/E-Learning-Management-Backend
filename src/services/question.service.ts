import { CustomError } from "@/configs";
import courseRepo from "@/repositories/course.repo";
import moduleRepo from "@/repositories/module.repo";
import questionRepo from "@/repositories/question.repo";
import quizzRepo from "@/repositories/quizz.repo";
import {
  BaseCreateQuestionProps,
  BaseUpdateQuestionProps,
  GetQuestionsProp,
} from "@/types/question";
import { UserPayload } from "@/types/user";
import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

class QuestionService {
  private section = QuestionService.name;

  private getCourseByQuizzId = async (quizzId: string) => {
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
    return course;
  };
  createQuestion = async (data: BaseCreateQuestionProps, user: UserPayload) => {
    const { quizzId, options } = data;

    const parsedOptions = options as Array<{
      content: string;
      isCorrect: boolean;
    }>;
    const correctOptionsCount = parsedOptions.filter(
      (option) => option.isCorrect,
    ).length;

    if (correctOptionsCount === 0) {
      throw new CustomError(
        "There must be at least one correct option",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }

    const course = await this.getCourseByQuizzId(quizzId);
    if (user.role.toString() !== "admin") {
      if (user.id !== course.teacherId) {
        throw new CustomError(
          "Course not belong to teacher",
          StatusCodes.BAD_REQUEST,
          this.section,
        );
      }
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

  getQuestions = async (filter: GetQuestionsProp) => {
    return await questionRepo.getMany(filter);
  };

  updateQuestion = async (
    filter: Prisma.QuestionWhereUniqueInput,
    data: BaseUpdateQuestionProps,
    user: UserPayload,
  ) => {
    const question = await questionRepo.getOne(filter);
    if (!question) {
      throw new CustomError(
        "Question not found",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    const course = await this.getCourseByQuizzId(question.quizzId);

    if (user.role.toString() !== "admin") {
      if (user.id !== course.teacherId) {
        throw new CustomError(
          "Course not belong to teacher",
          StatusCodes.BAD_REQUEST,
          this.section,
        );
      }
    }
    const { options } = data;
    const parsedOptions = options as Array<{
      content: string;
      isCorrect: boolean;
    }>;
    const correctOptionsCount = parsedOptions.filter(
      (option) => option.isCorrect,
    ).length;

    if (correctOptionsCount !== 1) {
      throw new CustomError(
        "There must be exactly one correct option",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }

    return await questionRepo.update(filter, data);
  };

  deleteQuestion = async (
    filter: Prisma.QuestionWhereUniqueInput,
    user: UserPayload,
  ) => {
    const question = await questionRepo.getOne(filter);
    if (!question) {
      throw new CustomError(
        "Question not found",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }

    const course = await this.getCourseByQuizzId(question.quizzId);

    if (user.role.toString() !== "admin") {
      if (user.id !== course.teacherId) {
        throw new CustomError(
          "Course not belong to teacher",
          StatusCodes.BAD_REQUEST,
          this.section,
        );
      }
    }
    const deletedQuestion = await questionRepo.delete(filter);
    const questionsBehind = await questionRepo.getMany(
      {
        quizzId: deletedQuestion.quizzId,
        position: {
          gt: deletedQuestion.position,
        },
      },
      {
        orderBy: {
          position: "asc",
        },
      },
    );
    questionsBehind.forEach(async (question) => {
      await questionRepo.update(
        { id: question.id },
        {
          position: question.position - 1,
        },
      );
    });
    return deletedQuestion;
  };
}
export default new QuestionService();
