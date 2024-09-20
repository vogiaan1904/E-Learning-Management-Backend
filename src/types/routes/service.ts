import { DefaultRouteProps } from "@/types/routes/default";

interface ServicesRoutesProps extends DefaultRouteProps {
  emailService: string;
}

export const serviceRoutes: ServicesRoutesProps = {
  index: "/services",
  default: "/",
  status: "/api-status",
  emailService: "/email",
};
