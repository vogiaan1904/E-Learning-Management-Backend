import { CustomError } from "@/configs";
import { AccessTokenProps } from "@/types/token";
import { Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const userRoleMiddleware = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as AccessTokenProps;

      if (!user) {
        throw new CustomError("User role is missing", StatusCodes.BAD_REQUEST);
      }

      if (user.role === Role.admin) {
        next();
      }
      console.log(user.role);

      if (!roles.includes(user.role)) {
        throw new CustomError("Permission denied", StatusCodes.FORBIDDEN);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
