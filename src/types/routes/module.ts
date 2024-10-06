import { DefaultRouteProps } from "@/types/routes/default";

interface ModuleRouteProps extends DefaultRouteProps {
  getModule: string;
  getModules: string;
  createModule: string;
  updateModule: string;
  deleteModule: string;
}

export const moduleRoute: ModuleRouteProps = {
  index: "/modules",
  default: "/",
  status: "/api-status",
  getModule: "/:id",
  getModules: "/many",
  createModule: "/",
  updateModule: "/:id",
  deleteModule: "/:id",
};
