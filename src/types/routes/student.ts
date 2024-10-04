import { DefaultRouteProps } from "@/types/routes/default";

interface StudentRouteProps extends DefaultRouteProps {
  getStudent: string;
  getStudents: string;
  createStudent: string;
  createStudents: string;
  updateStudent: string;
  updateStudents: string;
  deleteStudent: string;
  deleteStudents: string;
}

export const StudentRoute: StudentRouteProps = {
  index: "/students",
  default: "/",
  status: "/api-status",
  getStudent: "/:id",
  getStudents: "/many",
  createStudent: "/",
  createStudents: "/many",
  updateStudent: "/:id",
  updateStudents: "/many",
  deleteStudent: "/:id",
  deleteStudents: "/many",
};
