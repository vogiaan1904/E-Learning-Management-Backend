import { prisma } from "@/database/connect.db";
import userRepo from "@/repositories/user.repo";
import { hashData } from "@/utils/bcrypt";
import { Prisma, User, UserVerification } from "@prisma/client";
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
    return await userRepo.getOne(
      {
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
      {
        include: {
          userProfile: includeProfile,
        },
      },
    );
  };

  updateAUser = async (fields: Pick<User, "id">, user: Partial<UserFields>) => {
    return await userRepo.update(fields, user);
  };

  /**
   * Model UserProfile
   */

  createAUserProfile = async (data: Prisma.UserProfifleCreateInput) => {
    return await userRepo.createProfile(data);
  };

  /**
   * Model UserVerification
   */

  getAUserVerification = async (fields: Pick<UserVerification, "id">) => {
    return await userRepo.getVerification(fields);
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
    return await userRepo.createVerification({
      userId: userId,
      code: hashData(code),
      expiredAt: expiredAt,
      updatedAt: now,
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
    return await userRepo.updateVerification(
      { id },
      {
        code: hashData(code),
        expiredAt: expiredAt,
        updatedAt: now,
      },
    );
  };

  deleteAUserVerification = async (fields: Pick<UserVerification, "id">) => {
    return await userRepo.deleteVerification(fields);
  };

  deleteUserVerifications = async (
    fields: Prisma.UserVerificationWhereInput,
  ) => {
    return await userRepo.deleteVerifications(fields);
  };
}

export default new UserService();
