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
      const question = await questionService.createQuestion(
        req.body,
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
      const question = await questionService.updateQuestion(
        { id: questionId },
        req.body,
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
