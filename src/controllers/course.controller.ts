import CourseService from "@/services/course.service";
import enrollmentService from "@/services/enrollment.service";
import { CreateCourseProps, UpdateCourseProps } from "@/types/course";
import { CustomRequest, CustomUserRequest } from "@/types/request";
import { UserPayload } from "@/types/user";
import catchAsync from "@/utils/catchAsync";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
class CourseController {
  constructor() {}

  createACourse = catchAsync(
    async (req: CustomRequest<CreateCourseProps>, res: Response) => {
      const course = await CourseService.createACourse(req.body);
      res.status(StatusCodes.CREATED).json({
        message: "Course created successfully",
        course: course,
      });
    },
  );

  updateACourse = catchAsync(
    async (req: CustomRequest<UpdateCourseProps>, res: Response) => {
      const courseId = req.params.id;
      const course = await CourseService.updateACourse(
        { id: courseId },
        req.body,
      );
      return res.status(StatusCodes.OK).json({
        message: "Update course successfully",
        status: "success",
        course: course,
      });
    },
  );

  getACourseById = catchAsync(async (req: Request, res: Response) => {
    const courseId = req.params.id;
    const course = await CourseService.getACourse({ id: courseId });
    return res.status(StatusCodes.OK).json({
      message: "Get course successfully",
      status: "success",
      course: course,
    });
  });

  // getCoursesByCategory = catchAsync(async (req: Request, res: Response) => {
  //   const { category } = req.body;
  //   const courses = await CourseService.getCourseByCategory(category);
  //   return res.status(StatusCodes.OK).json({
  //     message: "Get courses successfully",
  //     status: "success",
  //     courses: courses,
  //   });
  // });

  getManyCourses = catchAsync(async (req: Request, res: Response) => {
    const courses = await CourseService.getManyCourses(req.query);
    return res.status(StatusCodes.OK).json({
      message: "Get courses successfully",
      status: "success",
      courses: courses,
    });
  });

  enrollACourse = catchAsync(
    async (req: CustomUserRequest<UserPayload>, res: Response) => {
      const user = req.user;
      const studentId = user.id;
      const courseId = req.params.id;
      const enrollment = await enrollmentService.enrollACourse({
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

  deleteACourse = catchAsync(async (req: Request, res: Response) => {
    const courseId = req.params.id;
    await CourseService.deleteACourse({ id: courseId });
    return res.status(StatusCodes.OK).json({
      message: "Get courses successfully",
      status: "success",
    });
  });
}

export default new CourseController();
