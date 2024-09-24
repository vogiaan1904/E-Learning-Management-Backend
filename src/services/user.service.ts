import { prisma } from "@/database/connect.db";
import { Optional } from "@/types/object";
import { hashData } from "@/utils/bcrypt";
import { Prisma, User, UserProfifle, UserVerification } from "@prisma/client";
import { addMinutes } from "date-fns";

interface UserFields extends Omit<User, "id"> {}
interface UserOptions {
  type?: "email" | "username" | "id";
  includeProfile?: boolean;
  deleteAction?: "soft" | "hard";
}

class UserService {
  private readonly prismaClient;

  constructor() {
    this.prismaClient = prisma;
  }

  /**
   * Model User
   */

  getAUser = async (fields: Prisma.UserWhereInput, options?: UserOptions) => {
    const { id, email, username } = fields;
    const { includeProfile } = options || {};
    return await this.prismaClient.user.findFirst({
      where: {
        OR: [
          {
            id: id,
          },
          {
            email: email,
          },
          {
            username: username,
          },
        ],
      },
      include: {
        userProfile: includeProfile || false,
      },
    });
  };

  createAUser = async (
    data: Optional<
      Pick<
        User,
        "email" | "username" | "password" | "profileId" | "isVerified" | "role"
      >,
      "isVerified" | "role"
    >,
  ) => {
    return await this.prismaClient.user.create({
      data: data,
    });
  };

  updateAUser = async (fields: Pick<User, "id">, user: Partial<UserFields>) => {
    return await this.prismaClient.user.update({
      where: fields,
      data: user,
    });
  };

  /**
   * Model UserProfile
   */

  createAUserProfile = async (
    data: Pick<UserProfifle, "firstName" | "lastName" | "avatar">,
  ) => {
    return await this.prismaClient.userProfifle.create({
      data: data,
    });
  };

  /**
   * Model UserVerification
   */

  getAUserVerification = async (fields: Pick<UserVerification, "id">) => {
    return await this.prismaClient.userVerification.findUnique({
      where: fields,
    });
  };

  createAUserVerification = async (
    data: Pick<UserVerification, "code" | "userId">,
    options?: {
      customExpriredDate: Date;
    },
  ) => {
    const now = new Date();
    const { userId, code } = data;
    const expiredAt = options?.customExpriredDate || addMinutes(now, 5);
    return await this.prismaClient.userVerification.create({
      data: {
        userId: userId,
        code: hashData(code),
        expiredAt: expiredAt,
        updatedAt: now,
      },
    });
  };

  updateAUserVerification = async (
    data: Pick<UserVerification, "code" | "id">,
    options?: {
      customExpriredDate: Date;
    },
  ) => {
    const now = new Date();
    const { id, code } = data;
    const expiredAt = options?.customExpriredDate || addMinutes(now, 5);
    return await this.prismaClient.userVerification.update({
      where: {
        id: id,
      },
      data: {
        code: hashData(code),
        expiredAt: expiredAt,
        updatedAt: now,
      },
    });
  };

  deleteAUserVerification = async (fields: Pick<UserVerification, "id">) => {
    return await this.prismaClient.userVerification.delete({
      where: fields,
    });
  };

  deleteUserVerifications = async (
    fields: Prisma.UserVerificationWhereInput,
  ) => {
    return await this.prismaClient.userVerification.deleteMany({
      where: fields,
    });
  };
}

export default new UserService();
