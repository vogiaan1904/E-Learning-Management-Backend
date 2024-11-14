/* eslint-disable @typescript-eslint/no-empty-object-type */
import { DefaultRouteProps } from "@/types/routes/default";

interface ServerRoutesProps extends DefaultRouteProps {}

export const serverRoutes: ServerRoutesProps = {
  index: "/",
  default: "/",
  status: "/api_status",
};
