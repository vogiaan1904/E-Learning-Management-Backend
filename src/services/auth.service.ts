import { CustomError, createWinstonLogger } from "@/configs";
import userRepo from "@/repositories/user.repo";
import { SignUpProps } from "@/types/auth";
import { generateCustomAvatarUrl } from "@/utils/avatar";
import { hashData } from "@/utils/bcrypt";
import { generateMailOptions, sendMail } from "@/utils/mail";
import { Role } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import tokenService from "./token.service";
import userService from "./user.service";

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
      this.logger.info("New use sign up success");

      return { user, userVerification };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}

export default new AuthService();
