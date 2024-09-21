import { prisma } from "@/database/connect.db";
import { hashData } from "@/utils/bcrypt";
import {
  Prisma,
  User,
  UserProfifle,
  UserToken,
  UserVerification,
} from "@prisma/client";
import { addDays, addMinutes } from "date-fns";

interface UserFields extends Omit<User, "id"> {}
interface UserOptions {
  type?: "email" | "username" | "id";
  includeProfile?: boolean;
  deleteAction?: "soft" | "hard";
}

/**
 * Model User
 */

export const getAUser = async (
  fields: Prisma.UserWhereInput,
  options?: UserOptions,
) => {
  const { id, email, username } = fields;
  const { includeProfile } = options || {};
  return await prisma.user.findFirst({
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

export const createAUser = async (
  data: Pick<User, "email" | "username" | "password" | "profileId">,
) => {
  return await prisma.user.create({
    data: data,
  });
};

export const updateAUser = async (
  fields: Pick<User, "id">,
  user: Partial<UserFields>,
) => {
  return await prisma.user.update({
    where: fields,
    data: user,
  });
};

/**
 * Model UserProfile
 */

export const createAUserProfile = async (
  data: Pick<UserProfifle, "firstName" | "lastName" | "avatar">,
) => {
  return await prisma.userProfifle.create({
    data: data,
  });
};

/**
 * Model UserVerification
 */

export const getAUserVerification = async (
  fields: Pick<UserVerification, "id">,
) => {
  return await prisma.userVerification.findUnique({
    where: fields,
  });
};

export const createAUserVerification = async (
  data: Pick<UserVerification, "code" | "userId">,
  options?: {
    customExpriredDate: Date;
  },
) => {
  const now = new Date();
  const { userId, code } = data;
  const expiredAt = options?.customExpriredDate || addMinutes(now, 5);
  return await prisma.userVerification.create({
    data: {
      userId: userId,
      code: hashData(code),
      expiredAt: expiredAt,
      updatedAt: now,
    },
  });
};

export const updateAUserVerification = async (
  data: Pick<UserVerification, "code" | "id">,
  options?: {
    customExpriredDate: Date;
  },
) => {
  const now = new Date();
  const { id, code } = data;
  const expiredAt = options?.customExpriredDate || addMinutes(now, 5);
  return await prisma.userVerification.update({
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

export const deleteAUserVerification = async (
  fields: Pick<UserVerification, "id">,
) => {
  return await prisma.userVerification.delete({
    where: fields,
  });
};

/**
 * Model UserToken
 */

export const createAUserToken = async (
  fields: Pick<UserToken, "id" | "token" | "userId">,
  customExpriredDate?: Date,
) => {
  const { id, token, userId } = fields;
  const now = new Date();
  const expiredAt = customExpriredDate || addDays(now, 1);
  return await prisma.userToken.create({
    data: {
      id: id,
      token: token,
      userId: userId,
      expiredAt: expiredAt,
    },
  });
};
