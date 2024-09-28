import { CustomError } from "@/configs";
import { CustomUserRequest } from "@/types/request";
import { Role, User } from "@prisma/client";
import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const userRoleMiddleware = (...roles: Role[]) => {
  return async (
    req: CustomUserRequest<User>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.user;

      // Kiểm tra xem user có tồn tại và có thuộc tính role không
      if (!user) {
        throw new CustomError("User role is missing", StatusCodes.BAD_REQUEST);
      }

      console.log(user.role);

      if (!roles.includes(user.role)) {
        throw new CustomError(
          "This operation is not permitted",
          StatusCodes.BAD_REQUEST,
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
