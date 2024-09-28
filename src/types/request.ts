import { Request } from "express";

export interface CustomUserRequest<T extends Express.User | undefined>
  extends Request {
  user: T;
}

export interface CustomRequest<T> extends Request {
  body: T;
}
