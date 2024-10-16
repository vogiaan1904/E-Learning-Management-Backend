import { routesConfig } from "@/configs";
import { authApis } from "@/routes/auth.route";
import { serverApis } from "@/routes/server.route";
import { Router } from "express";
import { userApis } from "./user.route";
import { teacherApis } from "./teacher.route";
import { courseApis } from "./course.route";
import { studentApis } from "./student.route";
import { enrollmentApis } from "./enrollment.route";
import { moduleApis } from "./module.route";

interface ConfigsProps {
  index: string;
  api: Router;
}

const router = Router();

const apiConfigs: ConfigsProps[] = [
  {
    index: routesConfig.serverRoutes.index,
    api: serverApis,
  },
  {
    index: routesConfig.authRoute.index,
    api: authApis,
  },
  {
    index: routesConfig.userRoute.index,
    api: userApis,
  },
  {
    index: routesConfig.teacherRoute.index,
    api: teacherApis,
  },
  {
    index: routesConfig.studentRoute.index,
    api: studentApis,
  },
  {
    index: routesConfig.courseRoute.index,
    api: courseApis,
  },
  {
    index: routesConfig.enrollmentRoute.index,
    api: enrollmentApis,
  },
  {
    index: routesConfig.moduleRoute.index,
    api: moduleApis,
  },
];

apiConfigs.forEach((c) => router.use(c.index, c.api));

export const apis = router;
