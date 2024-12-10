import { CustomError, envConfig } from "@/configs";
import userRepo from "@/repositories/user.repo";
import {
  changePasswordProps,
  ResetPasswordQueryProps,
  SendCodeProps,
  SignInProps,
  SignUpProps,
  VerifyCodeProps,
} from "@/types/auth";
import { RefreshTokenProps, ResetPasswordTokenProps } from "@/types/token";
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
import { Profile } from "passport-google-oauth20";
class AuthService {
  private section = AuthService.name;

  async googleSignIn(profile: Profile["_json"]) {
    const { given_name, family_name, email, email_verified, picture } = profile;
    let user = await userRepo.getOne({
      email: email,
    });
    if (!user) {
      user = await userRepo.create({
        username: `@${String(given_name).toLowerCase().replace(" ", "")}`,
        email: email || "",
        isVerified: Boolean(email_verified),
        password: "",
        userProfile: {
          create: {
            firstName: given_name || "",
            lastName: family_name || "",
            avatar: picture || "",
          },
        },
        role: Role.user,
        student: {
          create: {},
        },
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
    return {
      user,
      tokens,
    };
  }

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
    const userVerification = await userService.createUserVerification({
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
    const user = await userService.getUser(
      {
        email: method === "email" ? email : "",
        username: method === "username" ? username : "",
      },
      { includeProfile: true },
    );
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
      const userVerification = await userService.createUserVerification({
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
    const user = await userService.getUser({
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
    const userVerification = await userService.getUserVerification({
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
    await userService.updateUserVerification({
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
    const user = await userService.getUser(
      {
        id: userId,
      },
      { includeProfile: true },
    );
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
    await userService.updateUser(
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
    return { tokens, user };
  }

  async refreshToken(data: RefreshTokenProps) {
    const { sub, tokenId, email, role } = data;
    console.log(sub);
    const foundUser = await userService.getUser({
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

  async forgotPassword(email: string) {
    const user = await userService.getUser({ email });
    if (!user) {
      return {
        message:
          "If a user with that email exists, a password reset link has been sent.",
        status: "success",
      };
    }
    const tokenId = uuidv4();
    const token = await tokenService.generateJwtToken(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        tokenId: tokenId,
      },
      "rpt",
      envConfig.RESET_PASSWORD_TOKEN_EXPIRED,
    );

    const redisKey = tokenService.generateResetPasswordKey(tokenId);

    await redisService.setKey(
      redisKey,
      user.id,
      convertToSeconds(envConfig.RESET_PASSWORD_TOKEN_EXPIRED),
    );

    const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const mailOptions = generateMailOptions({
      receiverEmail: user.email,
      subject: "Reset password",
      template: "forgot-password",
      context: {
        name: user.username,
        resetURL,
      },
    });

    try {
      await sendMail(mailOptions);
    } catch (error) {
      console.log("error:", error);
      throw new CustomError(
        "Failed to send reset email.",
        StatusCodes.INTERNAL_SERVER_ERROR,
        this.section,
      );
    }

    return {
      message:
        "If a user with that email exists, a password reset link has been sent.",
      status: "success",
    };
  }

  async resetPassword(query: ResetPasswordQueryProps, password: string) {
    if (!query.token) {
      throw new CustomError(
        "Invalid token",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
    const decoded = tokenService.verifyToken<ResetPasswordTokenProps>(
      query.token,
      envConfig.RESET_PASSWORD_TOKEN_SECRET,
    );
    const { sub: userId, tokenId } = decoded;
    if (!userId || !tokenId) {
      throw new CustomError(
        "Invalid token payload",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }

    const redisKey = tokenService.generateResetPasswordKey(tokenId);

    const foundUserId = await redisService.getKey(redisKey);
    if (!foundUserId || foundUserId !== userId) {
      throw new CustomError(
        "Invalid or expired reset password token",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }

    const hashedPassword = hashData(password);
    await userService.updateUser({ id: userId }, { password: hashedPassword });

    await redisService.deleteKey(redisKey);

    return {
      message: "Password has been reset successfully.",
      status: "success",
    };
  }

  async changePassword(userId: string, data: changePasswordProps) {
    const { currentPassword, newPassword } = data;
    const user = await userService.getUser({ id: userId });
    if (!user) {
      throw new CustomError(
        "User not found",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    if (!compareHashData(currentPassword, user.password)) {
      throw new CustomError(
        "Current password is wrong",
        StatusCodes.UNAUTHORIZED,
        this.section,
      );
    }
    const hashedPassword = hashData(newPassword);
    await userService.updateUser({ id: userId }, { password: hashedPassword });
    return {
      message: "Password has been changed successfully.",
      status: "success",
    };
  }
}

export default new AuthService();
