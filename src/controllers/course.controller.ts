import CourseService from "@/services/course.service";
import { CreateCourseProps, UpdateCourseProps } from "@/types/course";
import { CustomRequest } from "@/types/request";
import { UserPayload } from "@/types/user";
import catchAsync from "@/utils/catchAsync";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
class CourseController {
  createCourse = catchAsync(
    async (req: CustomRequest<CreateCourseProps>, res: Response) => {
      const teacher = req.user as UserPayload;
      const teacherId = teacher.id;
      const course = await CourseService.createCourse(req.body, teacherId);
      res.status(StatusCodes.CREATED).json({
        message: "Course created successfully",
        status: "success",
        course: course,
      });
    },
  );

  getCourseById = catchAsync(async (req: Request, res: Response) => {
    const courseId = req.params.id;
    console.log(courseId);
    const { course, moduleIds } = await CourseService.getCourse({
      id: courseId,
    });
    return res.status(StatusCodes.OK).json({
      message: "Get course successfully",
      status: "success",
      course: course,
      moduleIds: moduleIds,
    });
  });

  getCourses = catchAsync(async (req: Request, res: Response) => {
    const courses = await CourseService.getCourses(req.query);
    return res.status(StatusCodes.OK).json({
      message: "Get courses successfully",
      status: "success",
      courses: courses,
    });
  });

  updateCourse = catchAsync(
    async (req: CustomRequest<UpdateCourseProps>, res: Response) => {
      const courseId = req.params.id;
      const course = await CourseService.updateCourse(
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

  deleteCourse = catchAsync(async (req: Request, res: Response) => {
    const courseId = req.params.id;
    await CourseService.deleteCourse({ id: courseId });
    return res.status(StatusCodes.OK).json({
      message: "Get courses successfully",
      status: "success",
    });
  });
}

export default new CourseController();
