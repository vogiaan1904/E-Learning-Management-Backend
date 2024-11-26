import { routesConfig } from "@/configs";
import notificationController from "@/controllers/notification.controller";
import { Router } from "express";

const router = Router({ mergeParams: true });
const { notificationRoute } = routesConfig;

router.get(
  notificationRoute.sendNotification,
  notificationController.sendNotification,
);

export const notificationApis = router;
