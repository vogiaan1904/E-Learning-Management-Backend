import { CustomError } from "@/configs";
import courseRepo from "@/repositories/course.repo";
import {
  CreateCourseProps,
  GetCoursesProps,
  UpdateCourseProps,
} from "@/types/course";
import { generateCourseFilter } from "@/utils/generateCourseFilter";
import { Course, Prisma, Role } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

class CourseService {
  private section = CourseService.name;

  createCourse = async (courseData: CreateCourseProps, teacherId: string) => {
    const { name } = courseData;

    const existedCourse = await courseRepo.getOne({ name });
    if (existedCourse) {
      throw new CustomError(
        "Course is already existed. Please use another information",
        StatusCodes.CONFLICT,
        this.section,
      );
    }
    const course = await courseRepo.create(courseData, teacherId);
    return course;
  };

  getCourse = async (
    userId: string,
    userRole: Role,
    filter: Prisma.CourseWhereInput,
  ) => {
    const { name, id, slug } = filter;

    let enrollmentOption; //get the enrollment based on the userRole
    enrollmentOption = true;
    if (userRole === Role.user) {
      enrollmentOption = {
        where: {
          studentId: userId,
        },
      };
    }

    const course = await courseRepo.getOne(
      {
        OR: [
          {
            id,
          },
          {
            name,
          },
          {
            slug,
          },
        ],
      },
      {
        include: {
          enrollments: enrollmentOption,
          modules: {
            select: {
              id: true,
            },
            orderBy: { position: "asc" },
          },
        },
      },
    );
    if (!course) {
      throw new CustomError(
        "Course not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }

    return { course };
  };

  getCourses = async (query: GetCoursesProps) => {
    const { filter, options } = generateCourseFilter(query);
    const courses = await courseRepo.getMany(filter, options);
    return courses;
  };

  getCoursesByTeacherId = async (filter: Pick<Course, "teacherId">) => {
    const courses = await courseRepo.getMany(filter);
    return courses;
  };

  updateCourse = async (
    filter: Pick<Course, "id">,
    courseData: UpdateCourseProps,
  ) => {
    const course = await courseRepo.getOne(filter);
    if (!course) {
      throw new CustomError(
        "Course not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    return await courseRepo.update(filter, courseData);
  };

  deleteCourse = async (filter: Pick<Course, "id">) => {
    const course = await courseRepo.getOne(filter);
    if (!course) {
      throw new CustomError(
        "Course not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    return await courseRepo.delete(filter);
  };
}
export default new CourseService();
