import { Category, Course } from "@prisma/client";

/* --------------------------------- Course --------------------------------- */
export interface CreateCourseProps
  extends Pick<Course, "name" | "description" | "teacherId"> {
  categories?: Array<string>;
}

export interface CreateCoursesProps {
  data: Array<CreateCourseProps>;
}

export interface UpdateCourseProps extends Partial<Course> {}

export interface UpdateCoursesProps {
  data: Array<UpdateCourseProps>;
}

export interface GetCoursesProps {
  skip?: string;
  limit?: string;
  teacherId?: string;
  category?: string;
}

/* -------------------------------- Category -------------------------------- */
export interface CreateCategoryProps extends Pick<Category, "name"> {}

export interface CreateCategoriesProps {
  data: Array<CreateCategoryProps>;
}

export interface UpdateCategoryProps extends Partial<Category> {}

export interface DeleteCategoriesProps {
  ids: Array<Category["id"]>;
}
