import { prisma } from "@/database/connect.db";
import { CreateNotificationProps } from "@/types/notification";
import { Prisma } from "@prisma/client";
import { Notification } from "@prisma/client";

class NotificationRepository {
  async create(data: CreateNotificationProps): Promise<Notification> {
    const { userId, content } = data;
    return await prisma.notification.create({
      data: {
        content: content as Prisma.InputJsonValue,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
  async getOne(
    filter: Prisma.NotificationWhereInput,
    options?: object,
  ): Promise<Notification | null> {
    return await prisma.notification.findFirst({
      where: filter,
      ...options,
    });
  }
  async getMany(
    filter: Prisma.NotificationWhereInput,
    options?: object,
  ): Promise<Notification[]> {
    return await prisma.notification.findMany({
      where: filter,
      ...options,
    });
  }
  async delete(
    filter: Prisma.NotificationWhereUniqueInput,
  ): Promise<Notification> {
    return await prisma.notification.delete({
      where: filter,
    });
  }
}

export default new NotificationRepository();
