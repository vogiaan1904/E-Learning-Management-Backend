/* eslint-disable  @typescript-eslint/no-explicit-any */

import { CustomError } from "@/configs";
import { Role } from "@prisma/client";
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

export const userRoleMiddleware = (...roles: Role[]) => {
  return (req: any, res: any, next: any): RequestHandler => {
    try {
      const user = req.user;

      if (!user) {
        throw new CustomError("User role is missing", StatusCodes.BAD_REQUEST);
      }

      if (user.role === Role.admin) {
        return next();
      }

      const userId = req.params.id;
      if (!roles.includes(user.role) || user.id !== userId) {
        throw new CustomError("Permission denied", StatusCodes.FORBIDDEN);
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
};
