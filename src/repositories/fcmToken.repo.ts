import { prisma } from "@/database/connect.db";
import { CreateFCMTokenProps, UpdateFCMTokenProps } from "@/types/fcmToken";
import { FCMToken, Prisma } from "@prisma/client";

class fcmTokenRepository {
  async create(data: CreateFCMTokenProps): Promise<FCMToken> {
    const { token, userId } = data;
    return await prisma.fCMToken.create({
      data: {
        token,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async getOne(
    filter: Prisma.FCMTokenWhereInput,
    options?: object,
  ): Promise<FCMToken | null> {
    return await prisma.fCMToken.findFirst({
      where: filter,
      ...options,
    });
  }

  async getMany(
    filter: Prisma.FCMTokenWhereInput,
    options?: object,
  ): Promise<FCMToken[]> {
    return await prisma.fCMToken.findMany({
      where: filter,
      ...options,
    });
  }

  async update(
    filter: Prisma.FCMTokenWhereUniqueInput,
    data: UpdateFCMTokenProps,
  ): Promise<FCMToken> {
    return await prisma.fCMToken.update({
      where: filter,
      data: data,
    });
  }

  async delete(filter: Prisma.FCMTokenWhereUniqueInput): Promise<FCMToken> {
    return await prisma.fCMToken.delete({ where: filter });
  }
}

export default new fcmTokenRepository();
