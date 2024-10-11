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
export interface updateEnrollmentProps
  extends OmitAndPartial<
    Enrollment,
    "id" | "courseId" | "studentId" | "enrolledAt"
  > {}
export interface enrollCourseProps extends Pick<Enrollment, "courseId"> {}
export interface feedBackCourseProps extends Pick<Enrollment, "feedback"> {}
