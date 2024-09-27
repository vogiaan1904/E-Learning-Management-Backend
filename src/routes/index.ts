import { routesConfig } from "@/configs";
import { authApis } from "@/routes/auth.route";
import { serverApis } from "@/routes/server.route";
import { Router } from "express";
import { userApis } from "./user.route";

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
];

apiConfigs.forEach((c) => router.use(c.index, c.api));

export const apis = router;
