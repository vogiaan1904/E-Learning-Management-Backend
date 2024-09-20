import { CustomError } from "@/configs";
import logger from "@/configs/logger.config";
import * as userService from "@/services/user.service";
import {
  SendCodeProps,
  SignInProps,
  SignUpProps,
  VerifyCodeProps,
} from "@/types/auth";
import { CustomRequest } from "@/types/request";
import { compareHashData, hashData } from "@/utils/bcrypt";
import { generateMailOptions, sendMail } from "@/utils/mail";
import { removeFieldsFromObject } from "@/utils/object";
import { generateVerificationCode, getJwtTokens } from "@/utils/token";
import { isAfter } from "date-fns";
import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

const generateCustomAvatarUrl = (firstName: string, lastName: string) => {
  return `https://avatar.iran.liara.run/username?username=${firstName}+${lastName}`;
};

export const signUp = async (
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
    const verificationCode = generateVerificationCode();
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
    logger.info("New use sign up success");
    return res.status(StatusCodes.CREATED).json({
      message: "Sign up success. Please check your email to verify the account",
      status: "success",
      userVerification: {
        id: userVerification.id,
        userId: userVerification.userId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (
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
      const verificationCode = generateVerificationCode();
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
      return res.status(StatusCodes.OK).json({
        userVerification: {
          id: userVerification.id,
          userId: userVerification.userId,
        },
        message:
          "User is not verified. Please check your email to verify the account.",
        status: "failed",
        code: StatusCodes.UNAUTHORIZED,
      });
    }
    const tokens = await getJwtTokens({
      id: user.id,
      email: user.email,
      role: user.role,
      tokenId: uuidv4(),
    });
    await userService.createAUserToken({
      id: tokens.tokenId,
      token: tokens.refreshToken,
      userId: user.id,
    });
    logger.info("User sign in success");
    removeFieldsFromObject(tokens, ["tokenId"]);
    return res.status(StatusCodes.OK).json({
      tokens,
      message: "Sign in in success",
      status: "success",
      code: StatusCodes.OK,
    });
  } catch (error) {
    next(error);
  }
};

export const sendCode = async (
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
    const verificationCode = generateVerificationCode();
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
    logger.info("Send code to user success");
    return res.status(StatusCodes.OK).json({
      message: "Please check your email to verify the account",
      status: "failed",
      code: StatusCodes.UNAUTHORIZED,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyCode = async (
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
    const tokens = await getJwtTokens({
      id: user.id,
      email: user.email,
      role: user.role,
      tokenId: uuidv4(),
    });
    await userService.createAUserToken({
      id: tokens.tokenId,
      token: tokens.refreshToken,
      userId: user.id,
    });
    removeFieldsFromObject(tokens, ["tokenId"]);
    logger.info("User verify success");
    return res.status(StatusCodes.OK).json({
      tokens,
      message: "Verified success",
      status: "success",
      code: StatusCodes.OK,
    });
  } catch (error) {
    next(error);
  }
};
