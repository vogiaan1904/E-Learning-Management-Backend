import { routesConfig } from "@/configs";
import moduleController from "@/controllers/module.controller";
import { accessTokenMiddleware, userRoleMiddleware } from "@/middlewares";
import { Role } from "@prisma/client";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router({ mergeParams: true });
const { moduleRoute } = routesConfig;

router.get(moduleRoute.status, (req: Request, res: Response) => {
  console.log(req.params);
  res.status(StatusCodes.OK).json({
    message: "Module APIs",
    status: "success",
  });
});

router.use(accessTokenMiddleware);

router.post(
  moduleRoute.createModule,
  userRoleMiddleware(Role.teacher),
  moduleController.createModule,
);

export const moduleApis = router;
