import { User } from "@prisma/client";
import { Request } from "express";

export interface CustomUserRequest<T extends Express.User | undefined>
  extends Request {
  user: T;
}

export interface CustomRequest<T> extends Request {
  body: T;
}

export interface CustomRequest2 extends Request {}

export interface CustomUserRequest2 extends CustomRequest2 {
  user: User;
}
