/* eslint-disable @typescript-eslint/no-empty-object-type */
import { FCMToken } from "@prisma/client";

export interface CreateFCMTokenProps
  extends Pick<FCMToken, "token" | "userId"> {}

export interface UpdateFCMTokenProps extends Pick<FCMToken, "lastActiveAt"> {}

export interface DeleteFCMTokenProps extends Pick<FCMToken, "token"> {}
