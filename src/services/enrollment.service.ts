import { CustomError } from "@/configs";
import courseRepo from "@/repositories/course.repo";
import enrollmentRepo from "@/repositories/enrollment.repo";
import { CreateEnrollmentProps, feedBackCourseProps } from "@/types/enrollment";
import { Enrollment, EnrollmentStatus, Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

class EnrollmentService {
  private section = EnrollmentService.name;

  createEnrollment = async (data: CreateEnrollmentProps) => {
    const { courseId, studentId } = data;
    const course = await courseRepo.getOne({ id: courseId });
    if (!course) {
      throw new CustomError(
        "Course not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    const enrolledCourse = await enrollmentRepo.getOne({ studentId, courseId });
    if (enrolledCourse) {
      throw new CustomError(
        "Course already enrolled.",
        StatusCodes.CONFLICT,
        this.section,
      );
    }
    return await enrollmentRepo.create(data);
  };

  getEnrollment = async (filter: Prisma.EnrollmentWhereInput) => {
    const enrollment = await enrollmentRepo.getOne(filter);
    if (!enrollment) {
      throw new CustomError(
        "Enrollment not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    return enrollment;
  };

  cancelEnrollment = async (filter: Prisma.EnrollmentWhereInput) => {
    const enrollment = await enrollmentRepo.getOne(filter);
    if (!enrollment) {
      throw new CustomError(
        "Enrollment not found.",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
    if (enrollment.status === EnrollmentStatus.CANCELLED) {
      throw new CustomError(
        "Enrollment already cancelled",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
    const cancelledEnrollment = await enrollmentRepo.update(
      { id: enrollment.id },
      { status: EnrollmentStatus.CANCELLED },
    );

    return cancelledEnrollment;
  };

  feedBack = async (
    filter: Pick<Enrollment, "id">,
    feedback: feedBackCourseProps,
  ) => {
    const enrollment = await enrollmentRepo.getOne(filter);
    if (!enrollment) {
      throw new CustomError(
        "Enrollment not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    return await enrollmentRepo.update(filter, feedback);
  };

  deleteEnrollment = async (filter: Pick<Enrollment, "id">) => {
    const enrollment = await enrollmentRepo.getOne(filter);
    if (!enrollment) {
      throw new CustomError(
        "Enrollment not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    return await enrollmentRepo.delete(filter);
  };
}

export default new EnrollmentService();
