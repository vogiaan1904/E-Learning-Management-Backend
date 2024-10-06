import { CustomError } from "@/configs";
import enrollmentRepo from "@/repositories/enrollment.repo";
import { GetEnrollmentsProps } from "@/types/enrollment";
import { generateEnrollmentFilter } from "@/utils/generateEnrollmentFilter";
import { StatusCodes } from "http-status-codes";

class StudentService {
  private section = StudentService.name;

  getEnrolledCourses = async (query: GetEnrollmentsProps) => {
    const { filter, options } = generateEnrollmentFilter(query);

    const enrollments = await enrollmentRepo.getMany(filter, options);
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
