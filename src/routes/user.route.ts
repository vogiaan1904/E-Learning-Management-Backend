import { routesConfig } from "@/configs";
import { CreateUserSchema, UpdateUserSchema } from "@/schemas/user.schema";
import { usersValidation } from "@/validations/users.validation";
import { Request, RequestHandler, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import userController from "@/controllers/user.controller";
import { accessTokenMiddleware, userRoleMiddleware } from "@/middlewares";
import { Role } from "@prisma/client";
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
  usersValidation(UpdateUserSchema),
  userController.updateAUser,
);

router.get(userRoute.getUser, userController.getAUser);

// router.use(userRoleMiddleware(Role.user, Role.teacher));

router.post(
  userRoute.createUser,
  accessTokenMiddleware,
  userRoleMiddleware(Role.admin) as unknown as RequestHandler,
  usersValidation(CreateUserSchema),
  userController.createAUser,
);

export const userApis = router;
