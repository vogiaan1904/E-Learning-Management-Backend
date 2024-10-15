import { Course, Enrollment, EnrollmentStatus, Student } from "@prisma/client";
import { OmitAndPartial } from "./object";
/* ------------------------------- Enrollment ------------------------------- */
export interface CreateEnrollmentProps {
  courseId: Course["id"];
  studentId: Student["id"];
}

export interface GetEnrollmentsProps {
  studentId: string;
  skip?: string;
  limit?: string;
  myLearningTab?: EnrollmentStatus;
}
export interface UpdateEnrollmentProps
  extends OmitAndPartial<
    Enrollment,
    "id" | "courseId" | "studentId" | "enrolledAt"
  > {}

export interface UpdateLessonProgessProp {
  lessonId: string;
}

export interface UpdateModuleProgessProp {
  moduleId: string;
}

export interface EnrollCourseProps extends Pick<Enrollment, "courseId"> {}

export interface FeedBackCourseProps extends Pick<Enrollment, "feedback"> {}
