import { CustomError } from "@/configs";
import userRepo from "@/repositories/user.repo";
import { CreateUserProps } from "@/types/user";
import { generateCustomAvatarUrl } from "@/utils/avatar";
import { hashData } from "@/utils/bcrypt";
import { Prisma, Role, User, UserVerification } from "@prisma/client";
import { addMinutes } from "date-fns";
import { StatusCodes } from "http-status-codes";
interface UserOptions {
  type?: "email" | "username" | "id";
  includeProfile?: boolean;
  deleteAction?: "soft" | "hard";
}

class UserService {
  private section = UserService.name;

  /* ------------------------------- Model User ------------------------------- */

  createUser = async (userData: CreateUserProps) => {
    const { username, password, email, firstName, lastName, role } = userData;
    const existedUser = await userRepo.getOne({
      OR: [{ email }, { username }],
    });
    if (existedUser) {
      throw new CustomError(
        "User is already existed. Please use another information",
        StatusCodes.CONFLICT,
        this.section,
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

  getUser = async (filter: Prisma.UserWhereInput, options?: UserOptions) => {
    const { id, email, username } = filter;
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
      throw new CustomError(
        "User not found",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    return user;
  };

  getUsers = async (
    filter: Prisma.UserWhereInput = {},
    options?: UserOptions,
  ) => {
    const { includeProfile } = options || {};
    const users = await userRepo.getMany(filter, {
      include: {
        userProfile: includeProfile,
      },
    });
    if (!users || users.length === 0) {
      throw new CustomError(
        "User not found",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    return users;
  };

  updateUser = async (
    filter: Pick<User, "id">,
    data: Prisma.UserUpdateInput,
    options?: UserOptions,
  ) => {
    return await userRepo.update(filter, data, options);
  };

  /* --------------------------- Model UserProfifle --------------------------- */

  createUserProfile = async (data: Prisma.UserProfifleCreateInput) => {
    return await userRepo.createProfile(data);
  };

  updateUserProfile = async (
    filter: Pick<User, "id">,
    data: Prisma.UserProfifleUpdateInput,
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

  getUserVerification = async (fields: Pick<UserVerification, "id">) => {
    return await userRepo.getVerification(fields);
  };

  createUserVerification = async (
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

  updateUserVerification = async (
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

  deleteUserVerification = async (fields: Pick<UserVerification, "id">) => {
    return await userRepo.deleteVerification(fields);
  };

  deleteUserVerifications = async (
    fields: Prisma.UserVerificationWhereInput,
  ) => {
    return await userRepo.deleteVerifications(fields);
  };
}

export default new UserService();
