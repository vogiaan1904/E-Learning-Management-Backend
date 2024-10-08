/* eslint-disable @typescript-eslint/no-unused-vars */
import { CustomError, createWinstonLogger, envConfig } from "@/configs";
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
  const { status, statusCode, message, stack, data, section } = customError;
  const logger = createWinstonLogger(section);
  logger.error(`${method} ${originalUrl} -> Error: ${message}`);
  const response = {
    message: message,
    status: status,
    data: data,
  };
  if (envConfig.NODE_ENV === "development") {
    _.assign(response, { stack: stack });
  }
  logger.error(stack);

  return res
    .status(statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
    .json(response);
};
