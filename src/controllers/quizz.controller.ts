import quizzService from "@/services/quizz.service";
import {
  CreateQuizzProps,
  GetQuizzesProp,
  UpdateQuizzProps,
} from "@/types/quizz";
import { CustomRequest } from "@/types/request";
import { UserPayload } from "@/types/user";
import catchAsync from "@/utils/catchAsync";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class QuizzController {
  createQuizz = catchAsync(
    async (req: CustomRequest<CreateQuizzProps>, res: Response) => {
      const user = req.user as UserPayload;
      const teacherId = user.id;
      const quizz = await quizzService.createQuizz(req.body, teacherId);
      res.status(StatusCodes.CREATED).json({
        message: "Quizz created successfully",
        status: "success",
        quizz: quizz,
      });
    },
  );

  getQuizz = catchAsync(async (req: Request, res: Response) => {
    const quizzId = req.params.id;
    const quizz = await quizzService.getQuizz({ id: quizzId });
    res.status(StatusCodes.CREATED).json({
      message: "Get quizz successfully",
      status: "success",
      quizz: quizz,
    });
  });

  getQuizzes = catchAsync(
    async (req: CustomRequest<GetQuizzesProp>, res: Response) => {
      const { moduleId } = req.body;
      const quizzes = await quizzService.getQuizzes({ moduleId: moduleId });
      res.status(StatusCodes.CREATED).json({
        message: "Get quizz successfully",
        status: "success",
        quizzes: quizzes,
      });
    },
  );

  updateQuizz = catchAsync(
    async (req: CustomRequest<UpdateQuizzProps>, res: Response) => {
      const quizzId = req.params.id;
      const user = req.user as UserPayload;
      const teacherId = user.id;
      const quizz = await quizzService.updateQuizz(
        { id: quizzId },
        req.body,
        teacherId,
      );
      res.status(StatusCodes.CREATED).json({
        message: "Updated quizz successfully",
        status: "success",
        quizz: quizz,
      });
    },
  );

  deleteQuizz = catchAsync(
    async (req: CustomRequest<UpdateQuizzProps>, res: Response) => {
      const quizzId = req.params.id;
      const user = req.user as UserPayload;
      const teacherId = user.id;
      const quizz = await quizzService.deleteQuizz({ id: quizzId }, teacherId);
      res.status(StatusCodes.CREATED).json({
        message: "Deleted quizz successfully",
        status: "success",
        quizz: quizz,
      });
    },
  );
}

export default new QuizzController();
