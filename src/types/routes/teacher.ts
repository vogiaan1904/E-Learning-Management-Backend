import { DefaultRouteProps } from "@/types/routes/default";

interface TeacherRouteProps extends DefaultRouteProps {
  getTeacher: string;
  getTeachers: string;
  updateTeacher: string;
  updateTeachers: string;
  createCourse: string;
  deleteTeacher: string;
  deleteTeachers: string;
}

export const teacherRoute: TeacherRouteProps = {
  index: "/teachers",
  default: "/",
  status: "/api-status",
  getTeacher: "/:id",
  getTeachers: "/",
  updateTeacher: "/:id",
  updateTeachers: "/many",
  createCourse: "/create-course",
  deleteTeacher: "/:id",
  deleteTeachers: "/many",
};
