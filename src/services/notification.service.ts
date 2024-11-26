import { CustomError } from "@/configs";
import fcmTokenRepo from "@/repositories/fcmToken.repo";
import notificationRepo from "@/repositories/notification.repo";
import userRepo from "@/repositories/user.repo";
import { CreateFCMTokenProps, DeleteFCMTokenProps } from "@/types/fcmToken";
import { CreateNotificationProps } from "@/types/notification";
import { sendToOneToken } from "@/utils/notification";
import { Prisma } from "@prisma/client";
import { FirebaseError } from "firebase-admin";
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

  /* --------------------------- Send Notification --------------------------- */

  sendNotification = (content: { [key: string]: string }, tokens: string[]) => {
    const successfulMessages: Promise<string>[] = [];
    tokens.forEach(async (token) => {
      successfulMessages.push(
        sendToOneToken(content, token).catch(async (err: FirebaseError) => {
          console.log(err);
          if (
            err.code == "messaging/invalid-registration-token" ||
            err.code == "messaging/registration-token-not-registered"
          ) {
            const existedToken = await fcmTokenRepo.getOne({ token });
            if (existedToken) {
              await fcmTokenRepo.delete({ token });
            }
          }
          return err.message;
        }),
      );
    });
    return successfulMessages;
  };

  /* --------------------------- FCM Token --------------------------- */
  storeToken = async (data: CreateFCMTokenProps) => {
    const { token, userId } = data;
    const existedToken = await fcmTokenRepo.getOne({ token: token });
    if (existedToken) {
      return await fcmTokenRepo.update(
        { token: token },
        {
          user: {
            connect: {
              id: userId,
            },
          },
          lastActiveAt: new Date(),
        },
      );
    } else {
      return await fcmTokenRepo.create(data);
    }
  };

  deleteToken = async (filter: DeleteFCMTokenProps, userId: string) => {
    const existedToken = await fcmTokenRepo.getOne(filter);
    if (!existedToken) {
      throw new CustomError(
        "No token found",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    if (userId != existedToken.userId) {
      throw new CustomError(
        "Token not belong to this user",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
    return await fcmTokenRepo.delete(filter);
  };
}

export default new NotificationService();
