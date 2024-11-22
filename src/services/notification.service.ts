import { CustomError } from "@/configs";
import notificationRepo from "@/repositories/notification.repo";
import userRepo from "@/repositories/user.repo";
import { CreateNotificationProps } from "@/types/notification";
import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

class NotificationService {
  private section = NotificationService.name;
  createNotification = async (data: CreateNotificationProps) => {
    const { userId } = data;
    const user = await userRepo.getOne({ id: userId });
    if (!user) {
      throw new CustomError(
        "User not found",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    return await notificationRepo.create(data);
  };

  getNotification = async (
    filter: Prisma.NotificationWhereInput,
    options?: object,
  ) => {
    return await notificationRepo.getOne(filter, options);
  };
  getNotifications = async (filter: Prisma.NotificationWhereInput) => {
    return await notificationRepo.getMany(filter);
  };

  deleteNotification = async (filter: Prisma.NotificationWhereUniqueInput) => {
    return await notificationRepo.delete(filter);
  };
}

export default new NotificationService();
