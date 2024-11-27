import { DefaultRouteProps } from "@/types/routes/default";

interface NotificationRouteProps extends DefaultRouteProps {
  getNotification: string;
  getNotifications: string;
  sendFCMToken: string;

  //For testing purpose
  sendNotification: string;
}

export const notificationRoutes: NotificationRouteProps = {
  index: "/notifications",
  default: "/",
  status: "/api-status",
  getNotification: "/:id",
  getNotifications: "/many",
  sendFCMToken: "/send-token",

  //For testing
  sendNotification: "/send-notification",
};
