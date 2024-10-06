import { authRoute } from "@/types/routes/auth";
import { courseRoute } from "@/types/routes/course";
import { enrollmentRoute } from "@/types/routes/enrollment";
import { serverRoutes } from "@/types/routes/server";
import { serviceRoutes } from "@/types/routes/service";
import { studentRoute } from "@/types/routes/student";
import { teacherRoute } from "@/types/routes/teacher";
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
  teacherRoute: teacherRoute,
  studentRoute: studentRoute,
  enrollmentRoute: enrollmentRoute,
} as const;
