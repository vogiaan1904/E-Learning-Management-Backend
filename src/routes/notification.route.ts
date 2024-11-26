import { routesConfig } from "@/configs";
import notificationController from "@/controllers/notification.controller";
import { accessTokenMiddleware } from "@/middlewares";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router({ mergeParams: true });
const { notificationRoute } = routesConfig;

router.get(notificationRoute.status, (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: "Notification APIs",
    status: "success",
  });
});

router.use(accessTokenMiddleware);

router.post(
  notificationRoute.sendNotification,
  notificationController.sendNotification,
);

router.post(notificationRoute.sendFCMToken, notificationController.sendToken);

router.get(
  notificationRoute.getNotification,
  notificationController.getNotification,
);

router.get(
  notificationRoute.getNotifications,
  notificationController.getNotifications,
);

export const notificationApis = router;
