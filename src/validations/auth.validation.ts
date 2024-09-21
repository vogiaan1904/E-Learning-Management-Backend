import { CustomError } from "@/configs";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ObjectSchema } from "joi";

export const authValidation =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = schema.validate(req.body);
    if (error) {
      next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
    }
    req.body = value;
    next();
  };
