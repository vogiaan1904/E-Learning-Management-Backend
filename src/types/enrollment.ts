import { Enrollment } from "@prisma/client";

export interface enrollCourseProps extends Pick<Enrollment, "courseId"> {}
export interface feedBackCourseProps extends Pick<Enrollment, "feedback"> {}
