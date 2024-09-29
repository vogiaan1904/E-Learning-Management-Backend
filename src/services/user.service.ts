import { CustomError } from "@/configs";
import { prisma } from "@/database/connect.db";
import userRepo from "@/repositories/user.repo";
import { CreateUserProps } from "@/types/user";
import { generateCustomAvatarUrl } from "@/utils/avatar";
import { hashData } from "@/utils/bcrypt";
import {
  Prisma,
  Role,
  User,
  UserProfifle,
  UserVerification,
} from "@prisma/client";
import { addMinutes } from "date-fns";
import { StatusCodes } from "http-status-codes";
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

  /* ------------------------------- Model User ------------------------------- */

  createAUser = async (userData: CreateUserProps) => {
    const { username, password, email, firstName, lastName, role } = userData;
    const existedUser = await userRepo.getOne({
      OR: [{ email }, { username }],
    });
    if (existedUser) {
      throw new CustomError(
        "User is already existed. Please use another information",
        StatusCodes.CONFLICT,
      );
    }

    const userRoleData = {
      [Role.teacher]: { teacher: { create: {} } },
      [Role.admin]: { admin: { create: {} } },
      [Role.user]: { student: { create: {} } },
    };

    const userRole = role in userRoleData ? role : Role.user;

    const user = await userRepo.create({
      // nested creattion all sub tables, (userProfile, Student or Teacher)
      username: username,
      email: email,
      password: hashData(password),
      isVerified: true,
      userProfile: {
        create: {
          firstName,
          lastName,
          avatar: generateCustomAvatarUrl(firstName, lastName),
        },
      },
      role: userRole,
      ...userRoleData[userRole], // khi model student và teacher có thêm field thì phải làm giống userProfile
    });
    return user;
  };

  getAUser = async (fields: Prisma.UserWhereInput, options?: UserOptions) => {
    const { id, email, username } = fields;
    const { includeProfile } = options || {};
    const user = await userRepo.getOne(
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
    if (!user) {
      throw new CustomError("User not found", StatusCodes.NOT_FOUND);
    }
    return user;
  };

  updateAUser = async (
    filter: Pick<User, "id">,
    data: Partial<User>,
    options?: UserOptions,
  ) => {
    return await userRepo.update(filter, data, options);
  };

  /* --------------------------- Model UserProfifle --------------------------- */

  createAUserProfile = async (data: Prisma.UserProfifleCreateInput) => {
    return await userRepo.createProfile(data);
  };

  updateAUserProfile = async (
    filter: Pick<User, "id">,
    data: Partial<UserProfifle>,
  ) => {
    return await userRepo.update(
      filter,
      {
        userProfile: {
          update: data,
        },
      },
      {
        include: {
          userProfile: true,
        },
      },
    );
  };

  /* ------------------------- Model UserVerification ------------------------- */

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
