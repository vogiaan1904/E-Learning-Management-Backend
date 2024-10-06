import { DefaultRouteProps } from "@/types/routes/default";

interface StudentRouteProps extends DefaultRouteProps {
  getStudents: string;
  getEnrollments: string;
}

export const studentRoute: StudentRouteProps = {
  index: "/students",
  default: "/",
  status: "/api-status",

  getStudents: "/many",
  getEnrollments: "/my-learning",
};
