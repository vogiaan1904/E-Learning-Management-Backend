import { DefaultRouteProps } from "@/types/routes/default";

interface ModuleRouteProps extends DefaultRouteProps {
  createModule: string;
  getModule: string;
  getModules: string;
  updateModule: string;
  deleteModule: string;
}
export const moduleRoute: ModuleRouteProps = {
  index: "/courses/:courseId/modules",
  default: "/",
  status: "/api-status",
  createModule: "/",
  getModule: "/:id",
  getModules: "/many",
  updateModule: "/:id",
  deleteModule: "/:id",
};
