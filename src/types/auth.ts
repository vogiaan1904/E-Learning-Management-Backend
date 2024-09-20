import { User, UserProfifle, UserVerification } from "@prisma/client";
import Joi from "joi";

export interface SignInProps
  extends Pick<User, "username" | "password" | "email"> {
  method: string;
}

export interface SignUpProps
  extends Pick<
    User & UserProfifle,
    "username" | "password" | "email" | "firstName" | "lastName"
  > {}

export interface SendCodeProps extends Pick<User, "id" | "email"> {}

export interface VerifyCodeProps
  extends Pick<User & UserVerification, "id" | "code"> {}

export const SendCodeSchema = Joi.object<SendCodeProps>().keys({
  id: Joi.string().required(),
  email: Joi.string().email(),
});

export const VerifyCodeSchema = Joi.object<VerifyCodeProps>().keys({
  id: Joi.string().required(),
  code: Joi.string().required(),
});

export const SignInSchema = Joi.object<SignInProps>().keys({
  username: Joi.string().alphanum().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  method: Joi.string().valid("email", "username").required(),
});

export const SignUpSchema = Joi.object<SignUpProps>().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  username: Joi.string().alphanum().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
