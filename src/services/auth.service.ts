import { CustomError, envConfig } from "@/configs";
import userRepo from "@/repositories/user.repo";
import {
  SendCodeProps,
  SignInProps,
  SignUpProps,
  VerifyCodeProps,
} from "@/types/auth";
import { RefreshTokenProps } from "@/types/token";
import { generateCustomAvatarUrl } from "@/utils/avatar";
import { compareHashData, hashData } from "@/utils/bcrypt";
import { convertToSeconds } from "@/utils/date";
import { generateMailOptions, sendMail } from "@/utils/mail";
import { Role } from "@prisma/client";
import { isAfter } from "date-fns";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import redisService from "./redis.service";
import tokenService from "./token.service";
import userService from "./user.service";

class AuthService {
  private section = AuthService.name;
  async signUp(userData: SignUpProps) {
    const { username, password, email, firstName, lastName, role } = userData;
    const existedUser = await userRepo.getOne({
      OR: [
        {
          email: email,
        },
        {
          username: username,
        },
      ],
    });
    if (existedUser) {
      throw new CustomError(
        "User is already existed. Please sign in",
        StatusCodes.CONFLICT,
        this.section,
      );
    }

    const createRole = {};
    Object.assign(createRole, {
      [role]: {
        create: {},
      },
    });

    const user = await userRepo.create({
      // nested creattion all sub tables, (userProfile, Student or Teacher)
      username: username,
      email: email,
      password: hashData(password),
      userProfile: {
        create: {
          firstName,
          lastName,
          avatar: generateCustomAvatarUrl(firstName, lastName),
        },
      },
      role: Role[role],
      ...createRole,
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
    return { user, userVerification };
  }

  async signIn(userData: SignInProps) {
    const { email, username, password, method } = userData;
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
      throw new CustomError(
        "User is not verified. Please check your email.",
        StatusCodes.UNAUTHORIZED,
        this.section,
        {
          userVerification: {
            id: userVerification.id,
            userId: userVerification.userId,
          },
        },
      );
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

    return {
      user,
      tokens,
    };
  }

  async sendCode(data: SendCodeProps) {
    const { id, userId } = data;
    const user = await userService.getAUser({
      id: userId,
    });
    if (!user) {
      throw new CustomError(
        "User not found. Please sign up",
        StatusCodes.NOT_FOUND,
        this.section,
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
        this.section,
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
    return {
      message: "Please check your email to verify the account",
      status: "failed",
    };
  }

  async verifyCode(data: VerifyCodeProps) {
    const { id, code, userId } = data;
    const user = await userService.getAUser({
      id: userId,
    });
    if (!user) {
      throw new CustomError(
        "User not found. Please sign up",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    if (user.isVerified) {
      throw new CustomError(
        "User is already verified",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
    const userVerification = await userRepo.getVerification({ id });
    if (!userVerification) {
      throw new CustomError(
        "User verification not found",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    const requestTime = new Date();
    if (isAfter(requestTime, userVerification.expiredAt || Date.now())) {
      throw new CustomError(
        "Verification code is expired",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
    if (!compareHashData(code, userVerification.code)) {
      throw new CustomError(
        "Verification code is wrong",
        StatusCodes.UNAUTHORIZED,
        this.section,
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

    await userRepo.deleteVerification({ id: userVerification.id });

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
    return { tokens };
  }

  async refreshToken(data: RefreshTokenProps) {
    const { sub, tokenId, email, role } = data;
    const foundUser = await userService.getAUser({
      id: sub,
    });
    if (!foundUser) {
      throw new CustomError(
        "User not found",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    const foundToken = await redisService.getKey(
      tokenService.generateUserSessionKey(tokenId),
    );
    if (!foundToken) {
      throw new CustomError(
        "Refresh token not found",
        StatusCodes.NOT_FOUND,
        this.section,
      );
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
    return { accessToken };
  }
}

export default new AuthService();
