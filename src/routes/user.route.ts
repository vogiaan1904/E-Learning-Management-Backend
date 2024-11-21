import { routesConfig } from "@/configs";
import userController from "@/controllers/user.controller";
import { accessTokenMiddleware, userRoleMiddleware } from "@/middlewares";
import {
  CreateUserSchema,
  UpdateUserProfileSchema,
} from "@/schemas/user.schema";
import { dataValidation } from "@/validations/data.validation";
import { Role } from "@prisma/client";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
const router = Router();
const { userRoute } = routesConfig;

router.get(userRoute.status, (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: "User APIs",
    status: "success",
  });
});

router.post(
  userRoute.createUser,
  accessTokenMiddleware,
  userRoleMiddleware(Role.admin),
  dataValidation(CreateUserSchema),
  userController.createAUser,
);

router.get(userRoute.getUsers, userController.getUsers);

router.get(userRoute.getUser, userController.getAUser);

router.patch(
  userRoute.updateUser,
  accessTokenMiddleware,
  dataValidation(UpdateUserProfileSchema),
  userController.updateAUserProfile,
);

export const userApis = router;
