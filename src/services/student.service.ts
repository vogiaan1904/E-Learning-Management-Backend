import { CustomError } from "@/configs";
import enrollmentRepo from "@/repositories/enrollment.repo";
import { Enrollment } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

class StudentService {
  private section = StudentService.name;

  getEnrolledCourses = async (filter: Pick<Enrollment, "studentId">) => {
    const enrollments = await enrollmentRepo.getMany(filter);
    if (enrollments.length == 0) {
      throw new CustomError(
        "You have not enrolled any courses.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    return enrollments;
  };
}

export default new StudentService();
