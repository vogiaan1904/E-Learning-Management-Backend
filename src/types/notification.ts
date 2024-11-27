/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Notification } from "@prisma/client";

export interface CreateNotificationProps
  extends Pick<Notification, "userId" | "content"> {}
