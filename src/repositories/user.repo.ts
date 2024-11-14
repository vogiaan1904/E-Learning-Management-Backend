import { prisma } from "@/database/connect.db";
import { Prisma, User, UserProfifle, UserVerification } from "@prisma/client";

export interface UserVerificationInterface {
  userId: string;
  code: string;
  expiredAt: Date;
  updatedAt: Date;
}

class UserRepository {
  /* ---------------------------------- User ---------------------------------- */
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await prisma.user.create({
      data,
    });
  }

  async getOne(
    filter: Prisma.UserWhereInput,
    options?: object,
  ): Promise<User | null> {
    return await prisma.user.findFirst({
      where: filter,
      ...options,
    });
  }

  async getMany(
    filter: Prisma.UserWhereInput,
    options?: object,
  ): Promise<User[]> {
    return await prisma.user.findMany({
      where: filter,
      ...options,
    });
  }

  async update(
    filter: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
    options?: object,
  ): Promise<User> {
    return await prisma.user.update({
      where: filter,
      data: data,
      ...options,
    });
  }

  async delete(
    filter: Prisma.UserWhereUniqueInput,
    options?: object,
  ): Promise<User> {
    return await prisma.user.delete({
      where: filter,
      ...options,
    });
  }

  // async deleteMany(): Promise<Prisma.BatchPayload> {
  //   return await prisma.user.deleteMany({});
  // }
  /* --------------------------------- Profile -------------------------------- */

  async getProfile(
    filter: Prisma.UserProfifleWhereInput,
    options?: object,
  ): Promise<UserProfifle | null> {
    return await prisma.userProfifle.findFirst({
      where: filter,
      ...options,
    });
  }

  async createProfile(
    data: Prisma.UserProfifleCreateInput,
    options?: object,
  ): Promise<UserProfifle | null> {
    return await prisma.userProfifle.create({
      data,
      ...options,
    });
  }

  async updateProfile(
    filter: Prisma.UserProfifleWhereUniqueInput,
    data: Prisma.UserProfifleUpdateInput,
    options?: object,
  ): Promise<UserProfifle> {
    return await prisma.userProfifle.update({
      where: filter,
      data: data,
      ...options,
    });
  }
  /* ------------------------------ Verification ------------------------------ */
  async createVerification(
    data: UserVerificationInterface,
    options?: object,
  ): Promise<UserVerification> {
    return await prisma.userVerification.create({
      data,
      ...options,
    });
  }

  async getVerification(
    filter: Prisma.UserVerificationWhereInput,
  ): Promise<UserVerification | null> {
    const userVerification = await prisma.userVerification.findFirst({
      where: filter,
    });
    return userVerification;
  }

  async updateVerification(
    filter: Prisma.UserVerificationWhereUniqueInput,
    data: Prisma.UserVerificationUpdateInput,
  ): Promise<UserVerification> {
    return await prisma.userVerification.update({
      where: filter,
      data: data,
    });
  }

  async deleteVerification(
    filter: Prisma.UserVerificationWhereUniqueInput,
  ): Promise<UserVerification> {
    return await prisma.userVerification.delete({
      where: filter,
    });
  }

  async deleteVerifications(
    filter: Prisma.UserVerificationWhereInput,
  ): Promise<{ count: number }> {
    return await prisma.userVerification.deleteMany({
      where: filter,
    });
  }
}

export default new UserRepository();
