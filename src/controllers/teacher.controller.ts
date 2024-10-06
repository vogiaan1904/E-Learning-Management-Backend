import courseService from "@/services/course.service";
import userService from "@/services/user.service";
import { CustomUserRequest } from "@/types/request";
import { UserPayload } from "@/types/user";
import catchAsync from "@/utils/catchAsync";
import { Role } from "@prisma/client";
import { Request, Response } from "express";

import { StatusCodes } from "http-status-codes";

class TeacherController {
  constructor() {}

  getTeachers = catchAsync(async (req: Request, res: Response) => {
    const teachers = await userService.getUsers({ role: Role.teacher });
    return res.status(StatusCodes.OK).json({
      message: "Get Teachers successfully",
      status: "success",
      teachers: teachers,
    });
  });

  getCourses = catchAsync(
    async (req: CustomUserRequest<UserPayload>, res: Response) => {
      const teacherId = req.user.id;
      const courses = await courseService.getCoursesByTeacherId({
        teacherId: teacherId,
      });
      return res.status(StatusCodes.OK).json({
        message: "Get teacher's courses successfully",
        status: "success",
        courses: courses,
      });
    },
  );
}

export default new TeacherController();
