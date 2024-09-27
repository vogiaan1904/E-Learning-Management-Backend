import { envConfig } from "@/configs";
import { createWinstonLogger } from "@/configs/logger.config";
import authService from "@/services/auth.service";
import userService from "@/services/user.service";
import {
  FacebookProfileProps,
  SendCodeProps,
  SignInProps,
  SignUpProps,
  VerifyCodeProps,
} from "@/types/auth";
import { CustomRequest, CustomUserRequest } from "@/types/request";
import { RefreshTokenProps } from "@/types/token";
import { convertToMilliseconds } from "@/utils/date";
import { removeFieldsFromObject } from "@/utils/object";
import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
class authController {
  private readonly logger = createWinstonLogger(authController.name);

  constructor() {}

  facebookSignIn = async (
    req: CustomUserRequest<FacebookProfileProps>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {
        email,
        last_name,
        first_name,
        picture: {
          data: { url },
        },
      } = req.user;
      const existedUser = await userService.getAUser({
        email: email,
      });
      console.log(last_name, first_name, url, existedUser);
    } catch (error) {
      this.logger.error(error);
      next(error);
    }
  };

  signUp = async (
    req: CustomRequest<SignUpProps>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userVerification } = await authService.signUp(req.body);
      return res.status(StatusCodes.CREATED).json({
        message:
          "Sign up success. Please check your email to verify the account",
        status: "success",
        userVerification: {
          id: userVerification.id,
          userId: userVerification.userId,
        },
      });
    } catch (error) {
      this.logger.error(error);
      next(error);
    }
  };

  signIn = async (
    req: CustomRequest<SignInProps>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await authService.signIn(req.body);
      return res
        .cookie("refreshToken", result.tokens.refreshToken, {
          httpOnly: false,
          secure: false,
          path: "/",
          sameSite: "strict",
          priority: "high",
          maxAge: convertToMilliseconds(envConfig.REFRESH_TOKEN_EXPIRED),
        })
        .status(StatusCodes.OK)
        .json({
          user: {
            ...removeFieldsFromObject(result.user, ["password"]),
          },
          tokens: {
            ...removeFieldsFromObject(result.tokens, ["tokenId"]),
          },
          message: "Sign in success",
          status: "success",
        });
    } catch (error) {
      this.logger.error(error);
      next(error);
    }
  };

  signOut = async (
    req: CustomRequest<SendCodeProps>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      return res.status(StatusCodes.OK).clearCookie("refreshToken").json({
        message: "Sign out success",
        status: "success",
      });
    } catch (error) {
      this.logger.error(error);
      next(error);
    }
  };

  sendCode = async (
    req: CustomRequest<SendCodeProps>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await authService.sendCode(req.body);
      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      this.logger.error(error);
      next(error);
    }
  };

  verifyCode = async (
    req: CustomRequest<VerifyCodeProps>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await authService.verifyCode(req.body);
      return res
        .cookie("refreshToken", result.tokens.refreshToken, {
          httpOnly: false,
          secure: false,
          path: "/",
          sameSite: "strict",
          priority: "high",
          maxAge: convertToMilliseconds(envConfig.REFRESH_TOKEN_EXPIRED),
        })
        .status(StatusCodes.OK)
        .json({
          tokens: {
            ...removeFieldsFromObject(result.tokens, ["tokenId"]),
          },
          message: "Verify success",
          status: "success",
        });
    } catch (error) {
      this.logger.error(error);
      next(error);
    }
  };

  refreshToken = async (
    req: CustomRequest<RefreshTokenProps>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await authService.refreshToken(req.body);
      return res.status(StatusCodes.OK).json({
        tokens: {
          accessToken: result.accessToken,
        },
        message: "Refresh token success",
        status: "success",
      });
    } catch (error) {
      this.logger.error(error);
      next(error);
    }
  };
}

export default new authController();
