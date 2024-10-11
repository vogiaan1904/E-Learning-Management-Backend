import { routesConfig } from "@/configs";
import moduleController from "@/controllers/module.controller";
import { accessTokenMiddleware, userRoleMiddleware } from "@/middlewares";
import { dataValidation } from "@/validations/data.validation";
import { UpdateModuleSchema } from "@/schemas/module.schema";
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

router.get(moduleRoute.getModule, moduleController.getModuleById);

router.get(moduleRoute.getModules, moduleController.getModules);

router.patch(
  moduleRoute.updateModule,
  userRoleMiddleware(Role.teacher),
  dataValidation(UpdateModuleSchema),
  moduleController.updateModule,
);

router.delete(
  moduleRoute.deleteModule,
  userRoleMiddleware(Role.teacher),
  moduleController.deleteModule,
);
export const moduleApis = router;
