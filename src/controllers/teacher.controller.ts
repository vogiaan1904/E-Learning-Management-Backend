import { createWinstonLogger } from "@/configs";
import { Request, Response } from "express";
import courseService from "@/services/course.service";
import { CustomTokenProps } from "@/types/token";
import catchAsync from "@/utils/catchAsync";
import { StatusCodes } from "http-status-codes";

class TeacherController {
  private readonly logger = createWinstonLogger(TeacherController.name);

  constructor() {}

  getTeacherCourses = catchAsync(async (req: Request, res: Response) => {
    const teacher = req.user as CustomTokenProps;
    const teacherId = teacher.id;
    const courses = await courseService.getCoursesByTeacherId({
      teacherId: teacherId,
    });
    return res.status(StatusCodes.OK).json({
      message: "Get courses successfully",
      courses: courses,
    });
  });
}

export default new TeacherController();
