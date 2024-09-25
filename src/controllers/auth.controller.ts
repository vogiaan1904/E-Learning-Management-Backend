import { CustomError, envConfig } from "@/configs";
import { createWinstonLogger } from "@/configs/logger.config";
import redisService from "@/services/redis.service";
import tokenService from "@/services/token.service";
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
import { generateCustomAvatarUrl } from "@/utils/avatar";
import { compareHashData, hashData } from "@/utils/bcrypt";
import { convertToMilliseconds, convertToSeconds } from "@/utils/date";
import { generateMailOptions, sendMail } from "@/utils/mail";
import { removeFieldsFromObject } from "@/utils/object";
import { isAfter } from "date-fns";
import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

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
      const { username, password, email, firstName, lastName } = req.body;
      const existedUser = await userService.getAUser({
        username: username,
        email: email,
      });
      if (existedUser) {
        throw new CustomError(
          "User is already existed. Please sign in",
          StatusCodes.CONFLICT,
        );
      }
      const userProfile = await userService.createAUserProfile({
        firstName: firstName,
        lastName: lastName,
        avatar: generateCustomAvatarUrl(firstName, lastName),
      });
      const user = await userService.createAUser({
        username: username,
        email: email,
        password: hashData(password),
        profileId: userProfile.id,
      });
      const verificationCode = tokenService.generateVerificationCode();
      const userVerification = await userService.createAUserVerification({
        userId: user.id,
        code: verificationCode,
      });
      const mailOptions = generateMailOptions({
        receiverEmail: user.email,
        subject: "Verification code",
        template: "verification-code",
        context: {
          name: user.username,
          activationCode: verificationCode,
        },
      });
      await sendMail(mailOptions);
      this.logger.info("New use sign up success");
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
      const { email, username, password, method } = req.body;
      const user = await userService.getAUser({
        email: method === "email" ? email : "",
        username: method === "username" ? username : "",
      });
      if (!user) {
        throw new CustomError(
          "User not found. Please sign up",
          StatusCodes.NOT_FOUND,
        );
      }
      if (!compareHashData(password, user.password)) {
        throw new CustomError("Invalid credentials", StatusCodes.UNAUTHORIZED);
      }
      if (!user.isVerified) {
        const verificationCode = tokenService.generateVerificationCode();
        const userVerification = await userService.createAUserVerification({
          userId: user.id,
          code: verificationCode,
        });
        const mailOptions = generateMailOptions({
          receiverEmail: user.email,
          subject: "Verification code",
          template: "verification-code",
          context: {
            name: user.username,
            activationCode: verificationCode,
          },
        });
        await sendMail(mailOptions);
        return res.status(StatusCodes.UNAUTHORIZED).json({
          userVerification: {
            id: userVerification.id,
            userId: userVerification.userId,
          },
          message:
            "User is not verified. Please check your email to verify the account.",
          status: "failed",
        });
      }
      const tokens = await tokenService.getJwtTokens({
        id: user.id,
        email: user.email,
        role: user.role,
        tokenId: uuidv4(),
      });
      await redisService.setKey(
        tokenService.generateUserSessionKey(tokens.tokenId),
        tokens.refreshToken,
        convertToSeconds(envConfig.REFRESH_TOKEN_EXPIRED),
      );
      this.logger.info("User sign in success");
      return res
        .cookie("refreshToken", tokens.refreshToken, {
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
            ...removeFieldsFromObject(tokens, ["tokenId"]),
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
      const { id, userId } = req.body;
      const user = await userService.getAUser({
        id: userId,
      });
      if (!user) {
        throw new CustomError(
          "User not found. Please sign up",
          StatusCodes.NOT_FOUND,
        );
      }
      if (user.isVerified) {
        throw new CustomError(
          "User is already verified",
          StatusCodes.BAD_REQUEST,
        );
      }
      const userVerification = await userService.getAUserVerification({
        id: id,
      });
      if (!userVerification) {
        throw new CustomError(
          "User verification not found",
          StatusCodes.NOT_FOUND,
        );
      }
      const verificationCode = tokenService.generateVerificationCode();
      await userService.updateAUserVerification({
        id: id,
        code: verificationCode,
      });
      const mailOptions = generateMailOptions({
        receiverEmail: user.email,
        subject: "Verification code",
        template: "verification-code",
        context: {
          name: user.username,
          activationCode: verificationCode,
        },
      });
      await sendMail(mailOptions);
      this.logger.info("Send code to user success");
      return res.status(StatusCodes.OK).json({
        message: "Please check your email to verify the account",
        status: "failed",
      });
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
      const { id, code, userId } = req.body;
      const user = await userService.getAUser({
        id: userId,
      });
      if (!user) {
        throw new CustomError(
          "User not found. Please sign up",
          StatusCodes.NOT_FOUND,
        );
      }
      if (user.isVerified) {
        throw new CustomError(
          "User is already verified",
          StatusCodes.BAD_REQUEST,
        );
      }
      const userVerification = await userService.getAUserVerification({
        id: id,
      });
      if (!userVerification) {
        throw new CustomError(
          "User verification not found",
          StatusCodes.NOT_FOUND,
        );
      }
      const requestTime = new Date();
      if (isAfter(requestTime, userVerification.expiredAt || Date.now())) {
        throw new CustomError(
          "Verification code is expired",
          StatusCodes.BAD_REQUEST,
        );
      }
      if (!compareHashData(code, userVerification.code)) {
        throw new CustomError(
          "Verification code is wrong",
          StatusCodes.UNAUTHORIZED,
        );
      }
      await userService.updateAUser(
        {
          id: userVerification.userId,
        },
        {
          isVerified: true,
        },
      );
      await userService.deleteAUserVerification({
        id: userVerification.id,
      });
      const tokens = await tokenService.getJwtTokens({
        id: user.id,
        email: user.email,
        role: user.role,
        tokenId: uuidv4(),
      });
      await redisService.setKey(
        tokenService.generateUserSessionKey(tokens.tokenId),
        tokens.refreshToken,
        convertToSeconds(envConfig.REFRESH_TOKEN_EXPIRED),
      );
      this.logger.info("User verify success");
      return res
        .cookie("refreshToken", tokens.refreshToken, {
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
            ...removeFieldsFromObject(tokens, ["tokenId"]),
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
      const { sub, tokenId, email, role } = req.body;
      const foundUser = await userService.getAUser({
        id: sub,
      });
      if (!foundUser) {
        throw new CustomError("User not found", StatusCodes.NOT_FOUND);
      }
      const foundToken = await redisService.getKey(
        tokenService.generateUserSessionKey(tokenId),
      );
      if (!foundToken) {
        throw new CustomError("Refresh token not found", StatusCodes.NOT_FOUND);
      }
      const accessToken = await tokenService.generateJwtToken(
        {
          id: sub,
          tokenId: tokenId,
          email: email,
          role: role,
        },
        "at",
      );
      return res.status(StatusCodes.OK).json({
        tokens: {
          accessToken: accessToken,
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
