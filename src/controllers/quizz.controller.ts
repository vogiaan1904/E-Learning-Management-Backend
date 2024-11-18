import quizzService from "@/services/quizz.service";
import {
  CreateQuizzProps,
  GetQuizzesProp,
  UpdateQuizzProps,
} from "@/types/quizz";
import { SubmitSubmissionProps } from "@/types/quizzSubmission";
import { CustomRequest } from "@/types/request";
import { UserPayload } from "@/types/user";
import catchAsync from "@/utils/catchAsync";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class QuizzController {
  createQuizz = catchAsync(
    async (req: CustomRequest<CreateQuizzProps>, res: Response) => {
      const user = req.user as UserPayload;
      const quizz = await quizzService.createQuizz(req.body, user);
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
      const quizz = await quizzService.updateQuizz(
        { id: quizzId },
        req.body,
        user,
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
      const quizz = await quizzService.deleteQuizz({ id: quizzId }, user);
      res.status(StatusCodes.CREATED).json({
        message: "Deleted quizz successfully",
        status: "success",
        quizz: quizz,
      });
    },
  );

  startQuizz = catchAsync(async (req: Request, res: Response) => {
    const quizzId = req.params.id;
    const user = req.user as UserPayload;
    const studentId = user.id;

    const submission = await quizzService.startQuizz(quizzId, studentId);

    res.status(StatusCodes.CREATED).json({
      message: "Quiz started successfully",
      success: true,
      submission,
    });
  });

  submitQuizz = catchAsync(
    async (req: CustomRequest<SubmitSubmissionProps>, res: Response) => {
      const quizzId = req.params.id;
      const submissionId = req.params.submissionId;
      const user = req.user as UserPayload;
      const studentId = user.id;
      const { submissionAnswers } = req.body;

      if (
        !Array.isArray(submissionAnswers) ||
        submissionAnswers.some(
          (ans) =>
            typeof ans.questionId !== "string" ||
            !Array.isArray(ans.selectedOptions) ||
            ans.selectedOptions.some((opt) => typeof opt !== "string"),
        )
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Invalid submissionAnswers format.",
          success: false,
        });
      }

      const result = await quizzService.submitQuizz(
        quizzId,
        submissionId,
        studentId,
        submissionAnswers,
      );

      res.status(StatusCodes.OK).json({
        message: "Quiz submitted successfully",
        success: true,
        result,
      });
    },
  );
}

export default new QuizzController();
