import { routesConfig } from "@/configs";
import * as userController from "@/controllers/user.controller";
import { accessTokenMiddleware } from "@/middlewares/auth.middleware";
import { userRoleMiddleware } from "@/middlewares/role.middleware";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router();
const { userRoute } = routesConfig;

router.get(userRoute.status, (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: "Users APIs",
    status: "success",
  });
});

// Middlewares
router.use(accessTokenMiddleware);

// Users
router.get(userRoute.getUsers, userController.getUsers);
router.post(
  userRoute.createUsers,
  userRoleMiddleware,
  userController.createUsers,
);

// User
router.get(userRoute.getUser, userController.getUserById);
router.patch(userRoute.updateUser, userController.updateUserById);
router.delete(userRoute.deleteUser, userController.deleteUserById);

export const userApis = router;
