import { CustomError } from "@/configs";
import { AccessTokenProps } from "@/types/token";
import { Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const userRoleMiddleware = (...roles: Role[]) => {
  const section = userRoleMiddleware.name;
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as AccessTokenProps;

      if (!user) {
        throw new CustomError(
          "User role is missing",
          StatusCodes.UNAUTHORIZED,
          section,
        );
      }
      console.log(user.role);
      console.log(Role.admin);
      if (user.role == Role.admin.toString()) {
        next();
      }

      if (!roles.includes(user.role)) {
        throw new CustomError(
          "Permission denied",
          StatusCodes.FORBIDDEN,
          section,
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
