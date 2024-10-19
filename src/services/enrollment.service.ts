import { CustomError } from "@/configs";
import { prisma } from "@/database/connect.db";
import courseRepo from "@/repositories/course.repo";
import enrollmentRepo from "@/repositories/enrollment.repo";
import lessonRepo from "@/repositories/lesson.repo";
import moduleRepo from "@/repositories/module.repo";
import {
  CreateEnrollmentProps,
  FeedBackCourseProps,
  UpdateEnrollmentProps,
} from "@/types/enrollment";
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
        StatusCodes.CONFLICT,
        this.section,
      );
    }
    const cancelledEnrollment = await enrollmentRepo.update(
      { id: enrollment.id },
      { status: EnrollmentStatus.CANCELLED },
    );

    return cancelledEnrollment;
  };

  updateEnrollment = async (
    filter: Prisma.EnrollmentWhereUniqueInput,
    data: UpdateEnrollmentProps,
  ) => {
    const enrollment = await enrollmentRepo.getOne(filter);
    if (!enrollment) {
      throw new CustomError(
        "Enrollment not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    return await enrollmentRepo.update({ id: enrollment.id }, data);
  };

  updateLessonProgress = async (
    filter: Prisma.EnrollmentWhereUniqueInput,
    studentId: string,
    lessonId: string,
  ) => {
    const enrollment = await enrollmentRepo.getOne(filter);
    if (!enrollment) {
      throw new CustomError(
        "Enrollment not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    if (studentId !== enrollment.studentId) {
      throw new CustomError(
        "Enrollment not belong to student.",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
    const lesson = await lessonRepo.getOne({ id: lessonId });
    if (!lesson) {
      throw new CustomError(
        "Lesson not found.",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
    const course = await courseRepo.getOne({ id: enrollment.courseId });

    if (!course) {
      throw new CustomError(
        "Course not found.",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }

    if (enrollment.completedLessonsIds.includes(lessonId)) {
      throw new CustomError(
        "Lesson already completed.",
        StatusCodes.CONFLICT,
        this.section,
      );
    }

    enrollment.completedLessonsIds.push(lessonId);

    const newCompletion =
      (enrollment.completedLessonsIds.length * 100) / course.numLessons;

    const updatedEnrollment = await prisma.enrollment.update({
      where: {
        id: enrollment.id,
      },
      data: {
        completedLessonsIds: enrollment.completedLessonsIds,
        completion: newCompletion,
      },
    });
    return updatedEnrollment;
  };

  updateModuleProgress = async (
    filter: Prisma.EnrollmentWhereUniqueInput,
    studentId: string,
    moduleId: string,
  ) => {
    const enrollment = await enrollmentRepo.getOne(filter);
    if (!enrollment) {
      throw new CustomError(
        "Enrollment not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    if (studentId !== enrollment.studentId) {
      throw new CustomError(
        "Enrollment not belong to student.",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }

    const module = await moduleRepo.getOne({ id: moduleId });
    if (!module) {
      throw new CustomError(
        "Module not found.",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }

    const updatedEnrollment = await prisma.enrollment.update({
      where: {
        id: enrollment.id,
      },
      data: {
        completedModulesIds: {
          push: moduleId,
        },
      },
    });
    return updatedEnrollment;
  };

  feedBack = async (
    filter: Pick<Enrollment, "id">,
    feedback: FeedBackCourseProps,
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
