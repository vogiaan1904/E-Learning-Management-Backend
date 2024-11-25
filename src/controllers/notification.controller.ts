import notificationService from "@/services/notification.service";
import { CreateFCMTokenProps, DeleteFCMTokenProps } from "@/types/fcmToken";
import { CustomRequest } from "@/types/request";
import { UserPayload } from "@/types/user";
import catchAsync from "@/utils/catchAsync";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";

class NotificationController {
  sendToken = catchAsync(
    async (
      req: CustomRequest<Omit<CreateFCMTokenProps, "userId">>,
      res: Response,
    ) => {
      const user = req.user as UserPayload;
      const userId = user.id;
      const token = await notificationService.storeToken({
        token: req.body.token,
        userId,
      });
      res.status(StatusCodes.CREATED).json({
        message: "Store token successfully",
        status: "success",
        token: token,
      });
    },
  );

  deleteToken = catchAsync(
    async (req: CustomRequest<DeleteFCMTokenProps>, res: Response) => {
      const user = req.user as UserPayload;
      const userId = user.id;
      const token = await notificationService.deleteToken(
        {
          token: req.body.token,
        },
        userId,
      );
      res.status(StatusCodes.OK).json({
        message: "Delete token successfully",
        status: "success",
        token: token,
      });
    },
  );

  //For testing
  sendNotification = catchAsync(async (req: Request, res: Response) => {
    const content = {
      message: "Testing",
    };
    const tokens = ["Testing token here"];
    const result = await Promise.allSettled(
      notificationService.sendNotification(content, tokens),
    );
    res.status(StatusCodes.OK).json(result);
  });
}

export default new NotificationController();
