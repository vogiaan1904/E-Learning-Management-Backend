import { Course } from "@prisma/client";

/* --------------------------------- Course --------------------------------- */
export interface CreateCourseProps
  extends Pick<Course, "name" | "description"> {
  categories?: Array<string>;
}

export interface UpdateCourseProps extends Partial<Course> {}

export interface GetCoursesProps {
  skip?: string;
  limit?: string;
  teacherId?: string;
  category?: string;
}

/* ------------------------------- Enrollment ------------------------------- */
