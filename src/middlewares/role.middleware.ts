import { CustomError } from "@/configs";
import { unallowedRoles } from "@/types/role";
import { AccessTokenProps } from "@/types/token";
import { getValueFromObject } from "@/utils/object";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const userRoleMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = getValueFromObject<AccessTokenProps>(req, "auth");
    if (unallowedRoles.includes(data.role)) {
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
