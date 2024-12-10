import { envConfig } from "@/configs";
import { createWinstonLogger } from "@/configs/logger.config";
import authService from "@/services/auth.service";
import userService from "@/services/user.service";
import {
  changePasswordProps,
  FacebookProfileProps,
  ForgotPasswordProps,
  ResetPasswordProps,
  SendCodeProps,
  SignInProps,
  SignUpProps,
  VerifyCodeProps,
} from "@/types/auth";
import { CustomRequest, CustomUserRequest } from "@/types/request";
import { RefreshTokenProps } from "@/types/token";
import { UserPayload } from "@/types/user";
import catchAsync from "@/utils/catchAsync";
import { convertToMilliseconds } from "@/utils/date";
import { removeFieldsFromObject } from "@/utils/object";
import { User } from "@prisma/client";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Profile } from "passport-google-oauth20";
class AuthController {
  private readonly logger = createWinstonLogger(AuthController.name);

  constructor() {}

  getMe = catchAsync(async (req: CustomUserRequest<User>, res: Response) => {
    const { id } = req.user;
    const user = await userService.getUser(
      { id },
      {
        includeProfile: true,
      },
    );
    console.log(user);
    return res.status(StatusCodes.OK).json({
      message: "Get user successfully",
      status: "success",
      user: {
        ...removeFieldsFromObject(user, ["password"]),
      },
    });
  });

  googleSignIn = catchAsync(
    async (req: CustomUserRequest<Profile["_json"]>, res: Response) => {
      const response = await authService.googleSignIn(req.user);
      if (response["userVerification"]) {
        const { userVerification } = response;
        return res.redirect(
          `${envConfig.FRONT_END_URL}/verify/id=${userVerification.id}&userId=${userVerification.userId}`,
        );
      }
      if (response["tokens"]) {
        const { tokens } = response;
        return res.redirect(
          `${envConfig.FRONT_END_URL}/third-party?success=true&at=${tokens.accessToken}&rt=${tokens.refreshToken}`,
        );
      }
    },
  );

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
      const existedUser = await userService.getUser({
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
          message: "Sign in success",
          status: "success",
          tokens: {
            ...removeFieldsFromObject(result.tokens, ["tokenId"]),
          },
          user: {
            ...removeFieldsFromObject(result.user, ["password"]),
          },
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
          user: {
            ...removeFieldsFromObject(result.user, ["password"]),
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

  forgotPassword = catchAsync(
    async (req: CustomRequest<ForgotPasswordProps>, res: Response) => {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      return res.status(StatusCodes.OK).json(result);
    },
  );

  resetPassword = catchAsync(
    async (req: CustomRequest<ResetPasswordProps>, res: Response) => {
      const { newPassword } = req.body;
      const result = await authService.resetPassword(req.query, newPassword);
      return res.status(StatusCodes.OK).json(result);
    },
  );

  changePassword = catchAsync(
    async (req: CustomRequest<changePasswordProps>, res: Response) => {
      const user = req.user as UserPayload;
      const result = await authService.changePassword(user.id, req.body);
      return res.status(StatusCodes.OK).json(result);
    },
  );
}

export default new AuthController();
