/* eslint-disable @typescript-eslint/no-empty-object-type */
import { FCMToken, Prisma } from "@prisma/client";
import { Optional } from "./object";

export interface CreateFCMTokenProps
  extends Pick<FCMToken, "token" | "userId"> {}

export interface UpdateFCMTokenProps
  extends Optional<Prisma.FCMTokenUpdateInput, "lastActiveAt" | "user"> {}

export interface DeleteFCMTokenProps extends Pick<FCMToken, "token"> {}
