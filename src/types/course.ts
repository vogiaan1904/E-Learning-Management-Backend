import { Course } from "@prisma/client";
import { OmitAndPartial } from "./object";

/* --------------------------------- Course --------------------------------- */
export interface CreateCourseProps
  extends Pick<Course, "name" | "description" | "teacherId"> {
  categories?: Array<string>;
}

export interface UpdateCourseProps
  extends OmitAndPartial<Course, "createdAt" | "id" | "teacherId"> {}

export interface GetCoursesProps {
  skip?: string;
  limit?: string;
  teacherId?: string;
  category?: string;
}

/* ------------------------------- Enrollment ------------------------------- */
