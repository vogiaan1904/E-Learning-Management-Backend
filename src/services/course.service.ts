import { CustomError } from "@/configs";
import { prisma } from "@/database/connect.db";
import courseRepo from "@/repositories/course.repo";
import moduleRepo from "@/repositories/module.repo";
import {
  CreateCourseProps,
  GetCoursesProps,
  UpdateCourseProps,
} from "@/types/course";
import { generateCourseFilter } from "@/utils/generateCourseFilter";
import { Course, Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
interface CourseOptions {
  includeTeacher?: boolean;
}
class CourseService {
  private section = CourseService.name;

  createCourse = async (courseData: CreateCourseProps) => {
    const { name } = courseData;

    const existedCourse = await courseRepo.getOne({ name });
    if (existedCourse) {
      throw new CustomError(
        "Course is already existed. Please use another information",
        StatusCodes.CONFLICT,
        this.section,
      );
    }
    const course = await courseRepo.create(courseData);
    return course;
  };

  getCourse = async (
    filter: Prisma.CourseWhereInput,
    options?: CourseOptions,
  ) => {
    const { id, slug } = filter;
    const { includeTeacher } = options || {};
    const course = await courseRepo.getOne(
      {
        OR: [
          {
            id,
          },
          {
            slug,
          },
        ],
      },
      {
        include: {
          teacher: includeTeacher,
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
    const modules = await moduleRepo.getMany(
      { courseId: course.id },
      {
        orderBy: { position: "asc" },
        select: {
          id: true,
          name: true,
          description: true,
          position: true,
          lessons: {
            orderBy: { position: "asc" },
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    );
    const categoriesObj = await prisma.categoriesOnCourses.findMany({
      where: {
        course: {
          id: course.id,
        },
      },
      select: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });
    const categories = categoriesObj.map((category) => category.category.name);

    return { course, modules, categories };
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
    teacherId: string,
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
    if (teacherId !== course.teacherId) {
      throw new CustomError(
        "Course not belong to teacher.",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
    return await courseRepo.update(filter, courseData);
  };

  deleteCourse = async (filter: Pick<Course, "id">, teacherId: string) => {
    const course = await courseRepo.getOne(filter);
    if (!course) {
      throw new CustomError(
        "Course not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    if (teacherId !== course.teacherId) {
      throw new CustomError(
        "Course not belong to teacher.",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
    return await courseRepo.delete(filter);
  };
}
export default new CourseService();
