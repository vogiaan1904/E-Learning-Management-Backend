import { DefaultRouteProps } from "@/types/routes/default";

interface CourseRouteProps extends DefaultRouteProps {
  createCourse: string;
  getCourse: string;
  getCourses: string;
  updateCourse: string;
  uploadThumbnail: string;
  addReview: string;
  getReviews: string;
  deleteCourse: string;
}

export const courseRoute: CourseRouteProps = {
  index: "/courses",
  default: "/",
  status: "/api-status",
  createCourse: "/",
  getCourse: "/:id",
  getCourses: "/many",
  uploadThumbnail: "/:id/thumbnail",
  addReview: "/:id/reviews",
  getReviews: "/:id/reviews",
  updateCourse: "/:id",
  deleteCourse: "/:id",
};
