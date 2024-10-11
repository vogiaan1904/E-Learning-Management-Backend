import { DefaultRouteProps } from "@/types/routes/default";

interface EnrollmentRouteProps extends DefaultRouteProps {
  createEnrollment: string;
  getEnrollment: string;
  updateEnrollment: string;
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
  updateEnrollment: "/:id",
  cancelEnrollment: "/:id/cancel",
  feedBack: "/:id/feed-back",
  deleteEnrollment: "/:id",
};
