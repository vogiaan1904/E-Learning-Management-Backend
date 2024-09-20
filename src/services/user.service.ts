import { prisma } from "@/database/connect.db";
import { hashData } from "@/utils/bcrypt";
import { User, UserProfifle } from "@prisma/client";
import { addMinutes } from "date-fns";

export interface UserFields extends Partial<Omit<User, "id">> {}
export interface GetUserProps extends Pick<User, "email" | "id" | "username"> {}
export interface UserOptions {
  type?: "email" | "username" | "id";
  include?: boolean;
  deleteAction?: "soft" | "hard";
}

export const getUsers = async (includeProfile?: boolean) => {
  return await prisma.user.findMany({
    include: {
      userProfile: includeProfile,
    },
  });
};

export const deleteUsers = async (ids: string[], options: UserOptions) => {
  const { deleteAction } = options;
  if (deleteAction === "hard") {
    return await prisma.user.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }
  if (deleteAction === "soft") {
    const now = new Date();
    return await prisma.user.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        deletedAt: now,
      },
    });
  }
};

export const createUsers = async (
  data: Array<Pick<User, "email" | "password" | "username" | "profileId">>,
  options: UserOptions,
) => {
  const { include } = options;
  return await prisma.user.createManyAndReturn({
    data: data,
    include: {
      userProfile: include,
    },
  });
};

export const getUser = async (
  fields: Partial<GetUserProps>,
  options: UserOptions,
) => {
  let user;
  const { email, username, id } = fields;
  const { type, include } = options;
  if (type === "email" && email) {
    user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        userProfile: include,
      },
    });
    return user;
  }
  if (type === "username" && username) {
    user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      include: {
        userProfile: include,
      },
    });
    return user;
  }
  if (type === "id" && id) {
    user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        userProfile: include,
      },
    });
    return user;
  }
};

export const getUserVerificationById = async (id: string) => {
  return await prisma.userVerification.findUnique({
    where: {
      id: id,
    },
  });
};

export const createUser = async (
  username: string,
  password: string,
  email: string,
  profileId: string,
) => {
  const user = await prisma.user.create({
    data: {
      username: username,
      password: hashData(password),
      email: email,
      profileId: profileId,
    },
  });
  return user;
};

export const updateUser = async (id: string, user: UserFields) => {
  const now = new Date();
  return await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      ...user,
      updatedAt: now,
    },
  });
};

export const deleteUser = async (id: string, options: UserOptions) => {
  const { deleteAction } = options;
  if (deleteAction === "hard") {
    return await prisma.user.delete({
      where: {
        id: id,
      },
    });
  }
  if (deleteAction === "soft") {
    const now = new Date();
    return await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: now,
      },
    });
  }
};

export const createUserProfile = async (
  firstName: string,
  lastName: string,
) => {
  return await prisma.userProfifle.create({
    data: {
      firstName: firstName,
      lastName: lastName,
    },
  });
};

export const createUserProfiles = async (
  data: Array<Pick<UserProfifle, "firstName" | "lastName">>,
) => {
  return await prisma.userProfifle.createManyAndReturn({
    data: data,
    select: {
      id: true,
    },
  });
};

export const saveUserVerification = async (
  code: string,
  id: string,
  userId: string,
) => {
  const now = new Date();
  const expiredAt = addMinutes(now, 5);
  const userVerification = await prisma.userVerification.upsert({
    where: {
      id: id,
    },
    update: {
      code: hashData(code),
      expiredAt: expiredAt,
      updatedAt: now,
    },
    create: {
      user: {
        connect: {
          id: userId,
        },
      },
      code: hashData(code),
      expiredAt: expiredAt,
    },
  });
  return userVerification;
};

export const deleteUserVerification = async (id: string) => {
  return await prisma.userVerification.delete({
    where: {
      id: id,
    },
  });
};
