import {
  Prisma,
  PrismaClient,
  User,
  UserProfifle,
  UserVerification,
} from "@prisma/client";

export interface UserVerificationInterface {
  userId: string;
  code: string;
  expiredAt: Date;
  updatedAt: Date;
}
const prisma = new PrismaClient();
class UserRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }

  async getAll(
    filter: Prisma.UserWhereInput,
    options: object,
  ): Promise<User[]> {
    const users = await prisma.user.findMany({
      where: filter,
      ...options,
    });

    return users;
  }

  async getOne(
    filter: Prisma.UserWhereInput,
    options?: object,
  ): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: filter,
      ...options,
    });
    return user;
  }

  async createProfile(
    data: Prisma.UserProfifleCreateInput,
    options?: object,
  ): Promise<UserProfifle | null> {
    const userProfile = await prisma.userProfifle.create({
      data,
      ...options,
    });
    return userProfile;
  }

  async update(
    filter: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    const user = await prisma.user.update({
      where: filter,
      data: data,
    });
    return user;
  }

  async delete(filter: Prisma.UserWhereUniqueInput): Promise<User> {
    const deletedUser = await prisma.user.delete({
      where: filter,
    });
    return deletedUser;
  }

  async createVerification(
    data: UserVerificationInterface,
    options?: object,
  ): Promise<UserVerification> {
    const userVerification = await prisma.userVerification.create({
      data,
      ...options,
    });
    return userVerification;
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
    const userVerification = await prisma.userVerification.update({
      where: filter,
      data: data,
    });
    return userVerification;
  }

  async deleteVerification(
    filter: Prisma.UserVerificationWhereUniqueInput,
  ): Promise<UserVerification> {
    const userVerification = await prisma.userVerification.delete({
      where: filter,
    });

    return userVerification;
  }

  async deleteVerifications(
    filter: Prisma.UserVerificationWhereInput,
  ): Promise<{ count: number }> {
    const result = await prisma.userVerification.deleteMany({
      where: filter,
    });
    return result;
  }
}

export default new UserRepository();
