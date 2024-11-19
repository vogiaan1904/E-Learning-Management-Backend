import { DefaultRouteProps } from "./default";

interface SearchRouteProp extends DefaultRouteProps {
  search: string;
}

export const searchRoute: SearchRouteProp = {
  index: "/search",
  default: "/",
  status: "/api-status",
  search: "/",
};
