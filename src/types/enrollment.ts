import { Course, Enrollment, EnrollmentStatus, Student } from "@prisma/client";
/* ------------------------------- Enrollment ------------------------------- */
export interface CreateEnrollmentProps {
  courseId: Course["id"];
  studentId: Student["id"];
}

export interface GetEnrollmentsProps {
  studentId: string;
  skip?: string;
  limit?: string;
  status?: EnrollmentStatus;
}

export interface enrollCourseProps extends Pick<Enrollment, "courseId"> {}
export interface feedBackCourseProps extends Pick<Enrollment, "feedback"> {}
