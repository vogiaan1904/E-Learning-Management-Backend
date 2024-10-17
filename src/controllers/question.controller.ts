import questionService from "@/services/question.service";
import { CreateQuestionProps, UpdateQuestionProps } from "@/types/question";
import { CustomRequest } from "@/types/request";
import { UserPayload } from "@/types/user";
import catchAsync from "@/utils/catchAsync";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class QuestionController {
  createQuestion = catchAsync(
    async (req: CustomRequest<CreateQuestionProps>, res: Response) => {
      const user = req.user as UserPayload;
      const teacherId = user.id;
      const { content, quizzId } = req.body;
      const options = req.body.options!;
      const correctOption = options.find((option) => option.isCorrect);
      const wrongOptions = options.filter((option) => !option.isCorrect);
      const questionData = {
        content,
        correctOption: JSON.stringify(correctOption),
        wrongOptions: wrongOptions,
        quizzId: quizzId,
      };
      const question = await questionService.createQuestion(
        questionData,
        teacherId,
      );
      res.status(StatusCodes.CREATED).json({
        message: "Question created successfully",
        status: "success",
        question: question,
      });
    },
  );
  getQuestionbyId = catchAsync(async (req: Request, res: Response) => {
    const questionId = req.params.id;
    const question = await questionService.getQuestion({ id: questionId });
    res.status(StatusCodes.OK).json({
      message: "Get question successfully",
      status: "success",
      question: question,
    });
  });
  getQuestions = catchAsync(async (req: Request, res: Response) => {
    const questions = await questionService.getQuestions(req.query);
    res.status(StatusCodes.OK).json({
      message: "Get questions sucessfully",
      status: "success",
      questions: questions,
    });
  });
  updateQuestion = catchAsync(
    async (req: CustomRequest<UpdateQuestionProps>, res: Response) => {
      const questionId = req.params.id;
      const user = req.user as UserPayload;
      const teacherId = user.id;
      const updateData = { ...req.body };
      const options = req.body.options;
      if (options !== undefined) {
        const correctOption = options.find((option) => option.isCorrect);
        const wrongOptions = options.filter((option) => !option.isCorrect);
        delete updateData.options;
        updateData.correctOption = correctOption;
        updateData.wrongOptions = wrongOptions;
      }
      const question = await questionService.updateQuestion(
        { id: questionId },
        updateData,
        teacherId,
      );
      res.status(StatusCodes.OK).json({
        message: "Update question sucessfully",
        status: "success",
        question: question,
      });
    },
  );
  deleteQuestion = catchAsync(async (req: Request, res: Response) => {
    const questionId = req.params.id;
    const user = req.user as UserPayload;
    const teacherId = user.id;
    const deletedQuestion = await questionService.deleteQuestion(
      { id: questionId },
      teacherId,
    );
    res.status(StatusCodes.OK).json({
      message: "Delete question successfully",
      status: "success",
      deletedQuestion: deletedQuestion,
    });
  });
}

export default new QuestionController();
