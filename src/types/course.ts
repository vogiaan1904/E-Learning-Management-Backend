import { Course, CourseCategory } from "@prisma/client";

/* --------------------------------- Course --------------------------------- */
export interface CreateCourseProps
  extends Pick<Course, "name" | "description" | "teacherId"> {}

export interface CreateCoursesProps {
  data: Array<CreateCourseProps>;
}

export interface DeleteCoursesProps {
  ids: Array<Course["id"]>;
}
export interface UpdateCoursesProps {
  data: Array<Course>;
}

export interface UpdateCourseProps extends Partial<Course> {}

/* -------------------------------- Category -------------------------------- */
export interface CreateCourseCategoryProps
  extends Pick<CourseCategory, "categoryType"> {}

export interface CreateCourseCategoriesProps {
  data: Array<CreateCourseCategoryProps>;
}

export interface DeleteCourseCategoriesProps {
  ids: Array<CourseCategory["id"]>;
}
export interface UpdateCourseCategoriesProps {
  data: Array<CourseCategory>;
}

export interface UpdateCourseCategoryProps
  extends Pick<CourseCategory, "categoryType"> {}
