import { routesConfig } from "@/configs";
import { authApis } from "@/routes/auth.route";
import { serverApis } from "@/routes/server.route";
import { Router } from "express";
import { userApis } from "./user.route";
import { teacherApis } from "./teacher.route";
import { courseApis } from "./course.route";

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
    index: routesConfig.courseRoute.index,
    api: courseApis,
  },
];

apiConfigs.forEach((c) => router.use(c.index, c.api));

export const apis = router;
