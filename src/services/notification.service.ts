import { CustomError } from "@/configs";
import fcmTokenRepo from "@/repositories/fcmToken.repo";
import notificationRepo from "@/repositories/notification.repo";
import userRepo from "@/repositories/user.repo";
import { CreateFCMTokenProps, DeleteFCMTokenProps } from "@/types/fcmToken";
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

  /* --------------------------- FCM Token --------------------------- */
  storeToken = async (data: CreateFCMTokenProps) => {
    const { token } = data;
    const existedToken = await fcmTokenRepo.getOne({ token: token });
    if (existedToken) {
      return await fcmTokenRepo.update(
        { token: token },
        { lastActiveAt: new Date() },
      );
    } else {
      return await fcmTokenRepo.create(data);
    }
  };

  deleteToken = async (filter: DeleteFCMTokenProps) => {
    const existedToken = await fcmTokenRepo.getOne(filter);
    if (!existedToken) {
      throw new CustomError(
        "No token found",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    return await fcmTokenRepo.delete(filter);
  };
}

export default new NotificationService();
