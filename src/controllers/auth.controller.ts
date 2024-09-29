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
import catchAsync from "@/utils/catchAsync";
import { convertToMilliseconds } from "@/utils/date";
import { removeFieldsFromObject } from "@/utils/object";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
class authController {
  private readonly logger = createWinstonLogger(authController.name);

  constructor() {}

  facebookSignIn = catchAsync(
    async (req: CustomUserRequest<FacebookProfileProps>, res: Response) => {
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
      res.json({
        user: {
          ...removeFieldsFromObject(existedUser, ["password"]),
        },
        message: "Sign in success",
        status: "success",
      });
    },
  );

  signUp = catchAsync(
    async (req: CustomRequest<SignUpProps>, res: Response) => {
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
    },
  );

  signIn = catchAsync(
    async (req: CustomRequest<SignInProps>, res: Response) => {
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
    },
  );

  signOut = catchAsync(
    async (req: CustomRequest<SendCodeProps>, res: Response) => {
      return res.status(StatusCodes.OK).clearCookie("refreshToken").json({
        message: "Sign out success",
        status: "success",
      });
    },
  );

  sendCode = catchAsync(
    async (req: CustomRequest<SendCodeProps>, res: Response) => {
      const result = await authService.sendCode(req.body);
      return res.status(StatusCodes.OK).json(result);
    },
  );

  verifyCode = catchAsync(
    async (req: CustomRequest<VerifyCodeProps>, res: Response) => {
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
    },
  );

  refreshToken = catchAsync(
    async (req: CustomRequest<RefreshTokenProps>, res: Response) => {
      const result = await authService.refreshToken(req.body);
      return res.status(StatusCodes.OK).json({
        tokens: {
          accessToken: result.accessToken,
        },
        message: "Refresh token success",
        status: "success",
      });
    },
  );
}

export default new authController();
