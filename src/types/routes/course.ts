import { DefaultRouteProps } from "@/types/routes/default";

interface CourseRouteProps extends DefaultRouteProps {
  createCourse: string;
  getCourse: string;
  getCourses: string;
  updateCourse: string;
  deleteCourse: string;
  uploadThumbnail: string;
}

export const courseRoute: CourseRouteProps = {
  index: "/courses",
  default: "/",
  status: "/api-status",
  createCourse: "/",
  getCourse: "/:id",
  getCourses: "/many",
  updateCourse: "/:id",
  deleteCourse: "/:id",
  uploadThumbnail: "/:id/thumbnail",
};
