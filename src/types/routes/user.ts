import { DefaultRouteProps } from "@/types/routes/default";

interface UserRouteProps extends DefaultRouteProps {
  getUser: string;
  getUsers: string;
  createUser: string;
  createUsers: string;
  updateUser: string;
  updateUsers: string;
  deleteUser: string;
  deleteUsers: string;
}

export const userRoute: UserRouteProps = {
  index: "/users",
  default: "/",
  status: "/api-status",
  getUser: "/:id",
  getUsers: "/many",
  createUser: "/",
  createUsers: "/many",
  updateUser: "/:id",
  updateUsers: "/many",
  deleteUser: "/:id",
  deleteUsers: "/many",
};
