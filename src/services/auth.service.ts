import { CustomError, createWinstonLogger, envConfig } from "@/configs";
import userRepo from "@/repositories/user.repo";
import { SignInProps, SignUpProps } from "@/types/auth";
import { generateCustomAvatarUrl } from "@/utils/avatar";
import { compareHashData, hashData } from "@/utils/bcrypt";
import { generateMailOptions, sendMail } from "@/utils/mail";
import { Role } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import tokenService from "./token.service";
import userService from "./user.service";
import redisService from "./redis.service";
import { convertToSeconds } from "@/utils/date";
import { v4 as uuidv4 } from "uuid";

class AuthService {
  private readonly logger = createWinstonLogger(AuthService.name);

  async signUp(userData: SignUpProps) {
    try {
      const { username, password, email, firstName, lastName, role } = userData;
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
      //   const userProfile = await userService.createAUserProfile({
      //     firstName,
      //     lastName,
      //     avatar: generateCustomAvatarUrl(firstName, lastName),
      //   });

      const userRoleData = {};
      if (role === Role.teacher.toString()) {
        Object.assign(userRoleData, {
          teacher: {
            create: {},
          },
        });
      } else {
        Object.assign(userRoleData, {
          student: {
            create: {},
          },
        });
      }
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
        ...userRoleData, // khi model student và teacher có thêm field thì phải làm giống userProfile
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
      this.logger.info("New user sign up success");

      return { user, userVerification };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
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
    this.logger.info("User sign in success");

    return {
      tokens,
    };
  }
}

export default new AuthService();
