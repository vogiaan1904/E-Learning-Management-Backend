import { passwordRegex } from "@/types/regex";
import { UpdateUserProps } from "@/types/user";
import Joi from "joi";

export const UpdateUserSchema = Joi.object<UpdateUserProps>()
  .keys({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    username: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().regex(passwordRegex).optional(),
    phoneNumber: Joi.string().optional(),
    address: Joi.string().optional(),
    birth: Joi.date().optional(),
    avatar: Joi.string().optional(),
  })
  .min(1);
