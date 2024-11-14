import enrollmentService from "@/services/enrollment.service";
import {
  EnrollCourseProps,
  FeedBackCourseProps,
  UpdateEnrollmentProps,
  UpdateLessonProgessProp,
  UpdateModuleProgessProp,
} from "@/types/enrollment";
import { CustomRequest, CustomUserRequest } from "@/types/request";
import { UserPayload } from "@/types/user";
import catchAsync from "@/utils/catchAsync";
import { Enrollment } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class EnrollmentController {
  createEnrollment = catchAsync(
    async (req: CustomRequest<EnrollCourseProps>, res: Response) => {
      const user = req.user as UserPayload;
      const studentId = user.id;
      const courseId = req.body.courseId;
      const enrollment = await enrollmentService.createEnrollment({
        studentId,
        courseId,
      });
      return res.status(StatusCodes.OK).json({
        message: "Enrolled course successfully",
        status: "success",
        enrollment: enrollment,
      });
    },
  );

  getEnrollment = catchAsync(
    async (req: CustomRequest<Pick<Enrollment, "id">>, res: Response) => {
      const enrollmentId = req.params.id;
      const enrollment = await enrollmentService.getEnrollment({
        id: enrollmentId,
      });
      return res.status(StatusCodes.OK).json({
        message: "Get enrollment successfully",
        status: "success",
        enrollment: enrollment,
      });
    },
  );

  getEnrollments = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as UserPayload;
    const studentId = user.id;
    const enrollments = await enrollmentService.getEnrollments({ studentId });
    return res.status(StatusCodes.OK).json({
      message: "Get enrollments successfully",
      status: "success",
      enrollments: enrollments,
    });
  });

  updateEnrollment = catchAsync(
    async (req: CustomRequest<UpdateEnrollmentProps>, res: Response) => {
      const enrollmentId = req.params.id;
      const enrollment = await enrollmentService.updateEnrollment(
        { id: enrollmentId },
        req.body,
      );
      return res.status(StatusCodes.OK).json({
        message: "Updated Enrollment successfully",
        status: "success",
        enrollment: enrollment,
      });
    },
  );

  updateLessonProgress = catchAsync(
    async (req: CustomRequest<UpdateLessonProgessProp>, res: Response) => {
      const user = req.user as UserPayload;
      const enrollmentId = req.params.id;
      const studentId = user.id;
      const { lessonId } = req.body;
      const enrollment = await enrollmentService.updateLessonProgress(
        { id: enrollmentId },
        studentId,
        lessonId,
      );
      return res.status(StatusCodes.OK).json({
        message: "Updated Enrollment successfully",
        status: "success",
        enrollment: enrollment,
      });
    },
  );

  updateModuleProgress = catchAsync(
    async (req: CustomRequest<UpdateModuleProgessProp>, res: Response) => {
      const user = req.user as UserPayload;
      const enrollmentId = req.params.id;
      const studentId = user.id;
      const { moduleId } = req.body;
      const enrollment = await enrollmentService.updateModuleProgress(
        { id: enrollmentId },
        studentId,
        moduleId,
      );
      return res.status(StatusCodes.OK).json({
        message: "Updated Enrollment successfully",
        status: "success",
        enrollment: enrollment,
      });
    },
  );

  feedBack = catchAsync(
    async (req: CustomRequest<FeedBackCourseProps>, res: Response) => {
      const enrollmentId = req.params.id;
      const enrollment = await enrollmentService.feedBack(
        { id: enrollmentId },
        req.body,
      );
      return res.status(StatusCodes.OK).json({
        message: "Fed back successfully",
        status: "success",
        enrollment: enrollment,
      });
    },
  );

  cancelEnrollment = catchAsync(
    async (req: CustomUserRequest<UserPayload>, res: Response) => {
      const enrollmentId = req.params.id;
      const enrollment = await enrollmentService.cancelEnrollment({
        id: enrollmentId,
      });
      return res.status(StatusCodes.OK).json({
        message: "Cancelled enrollment successfully",
        status: "success",
        enrollment: enrollment,
      });
    },
  );

  deleteEnrollment = catchAsync(async (req: Request, res: Response) => {
    const enrollmentId = req.params.id;
    const enrollment = await enrollmentService.deleteEnrollment({
      id: enrollmentId,
    });
    return res.status(StatusCodes.OK).json({
      message: "Delete enrollment successfully",
      status: "success",
      enrollment: enrollment,
    });
  });
}

export default new EnrollmentController();
