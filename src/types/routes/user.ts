import { DefaultRouteProps } from "@/types/routes/default";

interface UserRouteProps extends DefaultRouteProps {
  getUsers: string;
  createUser: string;
  createUsers: string;
  updateUsers: string;
  deleteUsers: string;
  getUser: string;
  updateUser: string;
  deleteUser: string;
}

export const userRoute: UserRouteProps = {
  index: "/user",
  default: "/",
  status: "/api-status",
  getUser: "/:id",
  getUsers: "/",
  createUser: "/",
  createUsers: "/many",
  updateUser: "/:id",
  updateUsers: "/many",
  deleteUser: "/:id",
  deleteUsers: "/many",
};
