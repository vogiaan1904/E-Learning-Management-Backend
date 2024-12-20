import { routesConfig } from "@/configs";
import moduleController from "@/controllers/module.controller";
import { accessTokenMiddleware, userRoleMiddleware } from "@/middlewares";
import { dataValidation } from "@/validations/data.validation";
import {
  GetModulesQuerySchema,
  UpdateModuleSchema,
} from "@/schemas/module.schema";
import { Role } from "@prisma/client";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router({ mergeParams: true });
const { moduleRoute } = routesConfig;

router.get(moduleRoute.status, (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: "Module APIs",
    status: "success",
  });
});

router.post(
  moduleRoute.createModule,
  accessTokenMiddleware,
  userRoleMiddleware(Role.teacher, Role.admin),
  moduleController.createModule,
);

router.get(
  moduleRoute.getModules,
  dataValidation(GetModulesQuerySchema),
  moduleController.getModules,
);

router.get(moduleRoute.getModule, moduleController.getModuleById);

router.patch(
  moduleRoute.updateModule,
  accessTokenMiddleware,
  userRoleMiddleware(Role.teacher, Role.admin),
  dataValidation(UpdateModuleSchema),
  moduleController.updateModule,
);

router.delete(
  moduleRoute.deleteModule,
  accessTokenMiddleware,
  userRoleMiddleware(Role.teacher, Role.admin),
  moduleController.deleteModule,
);
export const moduleApis = router;
