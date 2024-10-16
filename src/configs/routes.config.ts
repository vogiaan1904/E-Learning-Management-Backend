import { authRoute } from "@/types/routes/auth";
import { courseRoute } from "@/types/routes/course";
import { enrollmentRoute } from "@/types/routes/enrollment";
import { lessonRoute } from "@/types/routes/lesson";
import { moduleRoute } from "@/types/routes/module";
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
  teacherRoute: teacherRoute,
  studentRoute: studentRoute,
  courseRoute: courseRoute,
  moduleRoute: moduleRoute,
  lessonRoute: lessonRoute,
  enrollmentRoute: enrollmentRoute,
} as const;
