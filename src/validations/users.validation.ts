/* eslint-disable  @typescript-eslint/no-explicit-any */

import { CustomError } from "@/configs";
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { ObjectSchema } from "joi";

export const usersValidation =
  (schema: ObjectSchema) =>
  (req: any, res: any, next: any): RequestHandler => {
    const { value, error } = schema.validate(req.body);
    if (error) {
      next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
    }
    req.body = value;
    return next();
  };
