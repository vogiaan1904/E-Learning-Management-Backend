import { DefaultRouteProps } from "@/types/routes/default";

interface EnrollmentRouteProps extends DefaultRouteProps {
  createEnrollment: string;
  getEnrollment: string;
  getEnrollments: string;
  updateEnrollment: string;
  updateLessonProgress: string;
  updateModuleProgress: string;
  cancelEnrollment: string;
  feedBack: string;
  deleteEnrollment: string;
}

export const enrollmentRoute: EnrollmentRouteProps = {
  index: "/enrollments",
  default: "/",
  status: "/api-status",

  createEnrollment: "/",
  getEnrollment: "/:id",
  getEnrollments: "/many",
  updateEnrollment: "/:id",
  updateLessonProgress: "/:id/lesson-progress",
  updateModuleProgress: "/:id/module-progress",
  cancelEnrollment: "/:id/cancel",
  feedBack: "/:id/feed-back",
  deleteEnrollment: "/:id",
};
