import { CustomError } from "@/configs";
import courseRepo from "@/repositories/course.repo";
import enrollmentRepo from "@/repositories/enrollment.repo";
import { CreateEnrollmentProps } from "@/types/course";
import { StatusCodes } from "http-status-codes";

class EnrollmentService {
  private section = EnrollmentService.name;

  enrollACourse = async (data: CreateEnrollmentProps) => {
    const { courseId } = data;
    const course = await courseRepo.getOne({ id: courseId });
    if (!course) {
      throw new CustomError(
        "Course not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    return await enrollmentRepo.enroll(data);
  };
}

export default new EnrollmentService();
