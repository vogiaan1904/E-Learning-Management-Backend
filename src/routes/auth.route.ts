import { routesConfig } from "@/configs";
import authController from "@/controllers/auth.controller";
import {
  accessTokenMiddleware,
  preSignInMiddleware,
  refreshTokenMiddleware,
} from "@/middlewares/auth.middleware";
import { isServerRequest } from "@/middlewares/server.middleware";
import {
  RefreshTokenSchema,
  SendCodeSchema,
  SignInSchema,
  SignUpSchema,
  VerifyCodeSchema,
} from "@/schemas/auth.schema";
import { dataValidation } from "@/validations/data.validation";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import passport from "passport";

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
  dataValidation(SignUpSchema),
  authController.signUp,
);

router.post(
  authRoute.signIn,
  preSignInMiddleware,
  dataValidation(SignInSchema),
  authController.signIn,
);

router.post(authRoute.signOut, authController.signOut);

router.post(
  authRoute.sendCode,
  dataValidation(SendCodeSchema),
  authController.sendCode,
);

router.post(
  authRoute.verifyCode,
  dataValidation(VerifyCodeSchema),
  authController.verifyCode,
);

router.post(
  authRoute.refreshToken,
  refreshTokenMiddleware,
  dataValidation(RefreshTokenSchema),
  authController.refreshToken,
);

router.get(authRoute.googleSignIn, passport.authenticate("google"));

router.get(
  authRoute.googleCallbackUrl,
  passport.authenticate("google"),
  isServerRequest,
  (req, res) => {
    res.status(StatusCodes.OK).json({
      ...req.user,
    });
  },
);

router.get(authRoute.facebookSignIn, passport.authenticate("facebook"));

router.get(
  authRoute.facebookCallbackUrl,
  passport.authenticate("facebook"),
  isServerRequest,
  (req, res) => {
    res.status(StatusCodes.OK).json({
      ...req.user,
    });
  },
);

router.get(authRoute.me, accessTokenMiddleware, (req, res) => {
  res.status(StatusCodes.OK).json({
    ...req.user,
  });
});

export const authApis = router;
