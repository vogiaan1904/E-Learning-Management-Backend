import lessonService from "@/services/lesson.service";
import {
  CreateLessonProps,
  GetLessonsProp,
  UpadteLessonProps,
  UpdateLessonContent,
} from "@/types/lesson";
import { CustomRequest } from "@/types/request";
import { UserPayload } from "@/types/user";
import catchAsync from "@/utils/catchAsync";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class LessonController {
  createLesson = catchAsync(
    async (req: CustomRequest<CreateLessonProps>, res: Response) => {
      const user = req.user as UserPayload;
      const teacherId = user.id;
      const lesson = await lessonService.createLesson(req.body, teacherId);
      res.status(StatusCodes.CREATED).json({
        message: "Lesson created successfully",
        status: "success",
        lesson: lesson,
      });
    },
  );
  getLesson = catchAsync(async (req: Request, res: Response) => {
    const lessonId = req.params.id;
    const lesson = await lessonService.getLesson({ id: lessonId });
    res.status(StatusCodes.CREATED).json({
      message: "Get lesson successfully",
      status: "success",
      lesson: lesson,
    });
  });

  getLessons = catchAsync(
    async (req: CustomRequest<GetLessonsProp>, res: Response) => {
      const lessons = await lessonService.getLessons(req.body);
      res.status(StatusCodes.CREATED).json({
        message: "Get lessons successfully",
        status: "success",
        lessons: lessons,
      });
    },
  );

  updateLessonInfor = catchAsync(
    async (req: CustomRequest<UpadteLessonProps>, res: Response) => {
      const lessonId = req.params.id;
      const user = req.user as UserPayload;
      const teacherId = user.id;
      const lesson = await lessonService.updateLessonInfor(
        { id: lessonId },
        req.body,
        teacherId,
      );
      res.status(StatusCodes.CREATED).json({
        message: "Updated lesson infor successfully",
        status: "success",
        lesson: lesson,
      });
    },
  );
  updateLessonContent = catchAsync(
    async (req: CustomRequest<UpdateLessonContent>, res: Response) => {
      const lessonId = req.params.id;
      const user = req.user as UserPayload;
      const teacherId = user.id;
      const lesson = await lessonService.updateLessonContent(
        { id: lessonId },
        req.body,
        teacherId,
      );
      res.status(StatusCodes.CREATED).json({
        message: "Updated lesson content successfully",
        status: "success",
        lesson: lesson,
      });
    },
  );

  deleteLesson = catchAsync(async (req: Request, res: Response) => {
    const lessonId = req.params.id;
    const user = req.user as UserPayload;
    const teacherId = user.id;
    const deletedLesson = await lessonService.deleteLesson(
      { id: lessonId },
      teacherId,
    );
    res.status(StatusCodes.CREATED).json({
      message: "Deleted lesson successfully",
      status: "success",
      deletedLesson: deletedLesson,
    });
  });
}

export default new LessonController();
