import { DefaultRouteProps } from "@/types/routes/default";

interface StudentRouteProps extends DefaultRouteProps {
  getStudent: string;
  getStudents: string;
  updateStudent: string;
  enrolledCourses: string;
  deleteStudent: string;
}

export const studentRoute: StudentRouteProps = {
  index: "/students",
  default: "/",
  status: "/api-status",
  getStudent: "/:id",
  getStudents: "/many",
  updateStudent: "/:id",
  enrolledCourses: "/enrolled-courses",
  deleteStudent: "/:id",
};
