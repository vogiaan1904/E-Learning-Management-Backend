import { DefaultRouteProps } from "@/types/routes/default";

interface TeacherRouteProps extends DefaultRouteProps {
  getCourses: string;
}

export const teacherRoute: TeacherRouteProps = {
  index: "/teachers",
  default: "/",
  status: "/api-status",

  getCourses: "/my-courses",
};
