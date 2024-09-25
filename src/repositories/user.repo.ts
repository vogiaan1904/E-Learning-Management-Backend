import { PrismaClient, Prisma, UserProfifle } from "@prisma/client";
import { User } from "@prisma/client";

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
}

export default new UserRepository();
