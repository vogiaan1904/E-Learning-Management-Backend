import { routesConfig } from "@/configs";
import { CreateUserSchema, UpdateUserSchema } from "@/schemas/user.schema";
import { usersValidation } from "@/validations/users.validation";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import userController from "@/controllers/user.controller";
const router = Router();
const { userRoute } = routesConfig;

router.get(userRoute.status, (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: "User APIs",
    status: "success",
  });
});

router.patch(
  userRoute.updateUser,
  usersValidation(UpdateUserSchema),
  userController.updateUser,
);

router.get(userRoute.getUser, userController.getUser);

router.post(
  userRoute.createUser,
  usersValidation(CreateUserSchema),
  userController.createAUser,
);

export const userApis = router;
