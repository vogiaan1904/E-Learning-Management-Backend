/* eslint-disable @typescript-eslint/no-unused-vars */
import { CustomError, envConfig } from "@/configs";
import logger from "@/configs/logger.config";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";

export const errorMiddleware = (
  customError: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { method, originalUrl } = req;
  const { status, statusCode, message, stack, data } = customError;
  logger.error(`${method} ${originalUrl} -> Error: ${message}`);
  const response = {
    message: message,
    status: status,
    data: data,
  };
  if (envConfig.NODE_ENV === "development") {
    _.assign(response, { stack: stack });
  }
  return res
    .status(statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
    .json(response);
};
