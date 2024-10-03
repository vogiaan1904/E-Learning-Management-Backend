import { CustomError } from "@/configs";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ObjectSchema } from "joi";

export const queryValidation =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = schema.validate(req.query, {
      abortEarly: false,
    });
    if (error) {
      next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
    }
    req.query = value;
    return next();
  };
