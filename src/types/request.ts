import { Request } from "express";

export interface CustomRequest<T> extends Request {
  body: T;
}

export interface CustomUserRequest<T extends Express.User | undefined>
  extends Request {
  user: T;
}
