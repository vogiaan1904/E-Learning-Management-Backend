import { authRoute } from "@/types/routes/auth";
import { courseRoute } from "@/types/routes/course";
import { serverRoutes } from "@/types/routes/server";
import { serviceRoutes } from "@/types/routes/service";
import { userRoute } from "@/types/routes/user";

export const routesConfig = {
  default: "/",
  landingPage: "/",
  swagger: {
    docs: "/docs",
    json: "/docs.json",
  },
  apis: "/api/v1",
  serverRoutes: serverRoutes,
  serviceRoutes: serviceRoutes,
  authRoute: authRoute,
  userRoute: userRoute,
  courseRoute: courseRoute,
} as const;
