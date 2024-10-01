import { DefaultRouteProps } from "@/types/routes/default";

interface CourseRouteProps extends DefaultRouteProps {
  createCourse: string;
  getCourse: string;
  getCourses: string;
  updateCourse: string;
  updateCourses: string;
  deleteCourse: string;
  deleteCourses: string;
}

export const courseRoute: CourseRouteProps = {
  index: "/courses",
  default: "/",
  status: "/api-status",
  createCourse: "/",
  getCourse: "/:id",
  getCourses: "/many",
  updateCourse: "/:id",
  updateCourses: "/many",
  deleteCourse: "/:id",
  deleteCourses: "/many",
};
