import { DefaultRouteProps } from "@/types/routes/default";

interface TeacherRouteProps extends DefaultRouteProps {
  getTeacher: string;
  getTeachers: string;
  updateTeacher: string;
  deleteTeacher: string;
}

export const teacherRoute: TeacherRouteProps = {
  index: "/teachers",
  default: "/",
  status: "/api-status",
  getTeacher: "/:id",
  getTeachers: "/",
  updateTeacher: "/:id",
  deleteTeacher: "/:id",
};
