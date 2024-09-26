import { routesConfig } from "@/configs";
import { UpdateUserSchema } from "@/schemas/user.schema";
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

router.post(
  userRoute.getUser,
  usersValidation(UpdateUserSchema),
  userController.updateUser,
);
