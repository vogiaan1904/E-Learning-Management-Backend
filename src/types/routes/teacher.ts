import { DefaultRouteProps } from "@/types/routes/default";

interface TeacherRouteProps extends DefaultRouteProps {
  getTeacher: string;
  getTeachers: string;
  updateTeacher: string;
  updateTeachers: string;
  createCourse: string;
  getCourse: string;
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
  getCourse: "/get-courses",
  deleteTeacher: "/:id",
  deleteTeachers: "/many",
};
