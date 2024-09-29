import { routesConfig } from "@/configs";
import userController from "@/controllers/user.controller";
import { accessTokenMiddleware, userRoleMiddleware } from "@/middlewares";
import {
  CreateUserSchema,
  UpdateUserProfileSchema,
} from "@/schemas/user.schema";
import { usersValidation } from "@/validations/users.validation";
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

router.use(accessTokenMiddleware);

router.patch(
  userRoute.updateUser,
  userRoleMiddleware(Role.teacher, Role.user),
  usersValidation(UpdateUserProfileSchema),
  userController.updateAUserProfile,
);

router.get(
  userRoute.getUser,
  userRoleMiddleware(Role.teacher, Role.user),
  userController.getAUser,
);

// router.use(userRoleMiddleware(Role.user, Role.teacher));

router.post(
  userRoute.createUser,
  userRoleMiddleware(Role.admin),
  usersValidation(CreateUserSchema),
  userController.createAUser,
);

export const userApis = router;
