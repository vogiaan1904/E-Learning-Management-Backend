import { routesConfig } from "@/configs";
import * as authController from "@/controllers/auth.controller";
import { preSignInMiddleware } from "@/middlewares/auth.middleware";
import {
  SendCodeSchema,
  SignInSchema,
  SignUpSchema,
  VerifyCodeSchema,
} from "@/types/auth";
import { authValidation } from "@/validations/auth.validation";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router();
const { authRoute } = routesConfig;

router.get(authRoute.status, (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: "Auth APIs",
    status: "success",
  });
});

router.post(
  authRoute.signUp,
  authValidation(SignUpSchema),
  authController.signUp,
);

router.post(
  authRoute.signIn,
  preSignInMiddleware,
  authValidation(SignInSchema),
  authController.signIn,
);

router.post(
  authRoute.sendCode,
  authValidation(SendCodeSchema),
  authController.sendCode,
);

router.post(
  authRoute.verifyCode,
  authValidation(VerifyCodeSchema),
  authController.verifyCode,
);

export const authApis = router;
