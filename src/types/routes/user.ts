import { DefaultRouteProps } from "@/types/routes/default";

interface UserRouteProps extends DefaultRouteProps {
  getUsers: string;
  createUsers: string;
  updateUsers: string;
  deleteUsers: string;
  getUser: string;
  updateUser: string;
  deleteUser: string;
}

export const userRoute: UserRouteProps = {
  index: "/users",
  default: "/",
  status: "/api-status",
  getUsers: "/",
  createUsers: "/many",
  updateUsers: "/many",
  deleteUsers: "/many",
  getUser: "/:id",
  updateUser: "/:id",
  deleteUser: "/:id",
};
