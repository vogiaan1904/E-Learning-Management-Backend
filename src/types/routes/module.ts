import { DefaultRouteProps } from "@/types/routes/default";

interface ModuleRouteProps extends DefaultRouteProps {
  getModule: string;
  getModules: string;
  createModule: string;
  createModules: string;
  updateModule: string;
  updateModules: string;
  deleteModule: string;
  deleteModules: string;
}

export const ModuleRoute: ModuleRouteProps = {
  index: "/modules",
  default: "/",
  status: "/api-status",
  getModule: "/:id",
  getModules: "/many",
  createModule: "/",
  createModules: "/many",
  updateModule: "/:id",
  updateModules: "/many",
  deleteModule: "/:id",
  deleteModules: "/many",
};
