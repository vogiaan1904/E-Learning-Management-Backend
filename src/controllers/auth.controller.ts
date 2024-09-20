import { CustomError, envConfig } from "@/configs";
import * as otherService from "@/services/other.service";
import * as userService from "@/services/user.service";
import {
  SendCodeProps,
  SignInProps,
  SignUpProps,
  VerifyCodeProps,
} from "@/types/auth";
import { CustomRequest } from "@/types/request";
import { TokenType } from "@/types/token";
import { compareHashData } from "@/utils/bcrypt";
import { generateJwtToken } from "@/utils/jwt";
import { generateMailOptions } from "@/utils/mail";
import { generateVerificationCode } from "@/utils/token";
import { User } from "@prisma/client";
import { addDays, isAfter } from "date-fns";
import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

const generatePayload = (
  user: User,
  tokenType: TokenType,
  tokenId?: string,
) => {
  if (tokenType === "at") {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  } else {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      tokenId: tokenId,
    };
  }
};

export const signUp = async (
  req: CustomRequest<SignUpProps>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;
    const existedUser = await userService.getUser(
      {
        email: email,
      },
      {
        type: "email",
      },
    );
    if (existedUser) {
      throw new CustomError("User is already existed", StatusCodes.CONFLICT);
    }
    const userProfile = await userService.createUserProfile(
      firstName,
      lastName,
    );
    const user = await userService.createUser(
      username,
      password,
      email,
      userProfile.id,
    );
    return res.status(StatusCodes.CREATED).json({
      message: "User sign up success",
      status: "success",
      userId: user.id,
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
    let user;
    const { username, password, email, method } = req.body;
    if (method === "username") {
      user = await userService.getUser(
        {
          email: username,
        },
        {
          type: "username",
        },
      );
    } else if (method === "email") {
      user = await userService.getUser(
        {
          email: email,
        },
        {
          type: "email",
        },
      );
    }
    if (!user) {
      throw new CustomError("User not found", StatusCodes.NOT_FOUND);
    }
    if (!compareHashData(password, user.password)) {
      throw new CustomError("Incorrect password", StatusCodes.UNAUTHORIZED);
    }
    if (!user.isVerified) {
      throw new CustomError("User is not verified", StatusCodes.UNAUTHORIZED, {
        id: user.id,
      });
    }
    const tokenId = uuidv4();
    const accessToken = generateJwtToken(generatePayload(user, "at"), "at");
    const refreshToken = generateJwtToken(
      generatePayload(user, "rt", tokenId),
      "rt",
    );
    res
      .status(StatusCodes.OK)
      .cookie("refreshToken", refreshToken, {
        httpOnly: false,
        secure: true,
        path: "/",
        sameSite: envConfig.NODE_ENV === "development" ? "strict" : "none",
        expires: addDays(Date.now(), 1), // 1 day
      })
      .json({
        message: "User sign in success",
        status: "success",
        data: {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
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
    const { id, email } = req.body;
    const user = await userService.getUser(
      {
        id: id,
      },
      {
        type: "id",
      },
    );
    if (!user) {
      throw new CustomError("User not found", StatusCodes.NOT_FOUND);
    }
    if (user.isVerified) {
      throw new CustomError("User is verified", StatusCodes.UNAUTHORIZED);
    }
    const receiverEmail = email || user.email;
    const code = generateVerificationCode();
    await userService.saveUserVerification(code, "", user.id);
    const mailOptions = generateMailOptions({
      receiverEmail: receiverEmail,
      subject: `Verification code - ${envConfig.NAME}`,
      template: "verification-code",
      context: {
        appName: envConfig.NAME,
        name: user.username,
        activationCode: code,
      },
    });
    await otherService.sendEmail(mailOptions);
    res.status(StatusCodes.OK).json({
      message: `Email sent successfully to ${receiverEmail}`,
      status: "success",
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
    const { id, code } = req.body;
    const user = await userService.getUser(
      {
        id: id,
      },
      {
        type: "id",
      },
    );
    if (!user) {
      throw new CustomError("User not found", StatusCodes.NOT_FOUND);
    }
    if (user.isVerified) {
      throw new CustomError("User is verified", StatusCodes.UNAUTHORIZED);
    }
    const userVerification = await userService.getUserVerificationById(id);
    if (!userVerification) {
      throw new CustomError(
        "User verification not found",
        StatusCodes.NOT_FOUND,
      );
    }
    const requestTime = new Date();
    const expiredTime = new Date(userVerification.expiredAt || Date.now());
    if (isAfter(requestTime, expiredTime)) {
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
    await userService.updateUser(userVerification.userId, {
      isVerified: true,
    });
    await userService.deleteUserVerification(userVerification.userId);
    res.status(StatusCodes.OK).json({
      message: "User is verified",
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};
