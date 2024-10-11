import enrollmentService from "@/services/enrollment.service";
import {
  enrollCourseProps,
  feedBackCourseProps,
  updateEnrollmentProps,
} from "@/types/enrollment";
import { CustomRequest, CustomUserRequest } from "@/types/request";
import { UserPayload } from "@/types/user";
import catchAsync from "@/utils/catchAsync";
import { Enrollment } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class EnrollmentController {
  createEnrollment = catchAsync(
    async (req: CustomRequest<enrollCourseProps>, res: Response) => {
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

  updateEnrollment = catchAsync(
    async (req: CustomRequest<updateEnrollmentProps>, res: Response) => {
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

  feedBack = catchAsync(
    async (req: CustomRequest<feedBackCourseProps>, res: Response) => {
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
