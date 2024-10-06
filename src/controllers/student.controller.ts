import studentService from "@/services/student.service";
import userService from "@/services/user.service";
import { CustomUserRequest } from "@/types/request";
import { UserPayload } from "@/types/user";
import catchAsync from "@/utils/catchAsync";
import { Role } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class StudentController {
  getManyStudents = catchAsync(async (req: Request, res: Response) => {
    const students = await userService.getUsers({ role: Role.user });
    return res.status(StatusCodes.OK).json({
      message: "Get students successfully",
      status: "success",
      students: students,
    });
  });

  getEnrollments = catchAsync(
    async (req: CustomUserRequest<UserPayload>, res: Response) => {
      const studentId = req.user.id;
      const courses = await studentService.getEnrolledCourses({ studentId });
      return res.status(StatusCodes.OK).json({
        message: "Get enrollments successfully",
        status: "success",
        courses: courses,
      });
    },
  );
}
export default new StudentController();
