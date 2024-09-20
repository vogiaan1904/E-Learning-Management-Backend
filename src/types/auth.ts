import { passwordRegex } from "@/types/regex";
import { User, UserProfifle, UserVerification } from "@prisma/client";
import Joi from "joi";

export interface PreSigninProps extends Pick<User, "password"> {
  account: string;
}

export interface SignInProps
  extends Pick<User, "username" | "password" | "email"> {
  method: string;
}

export interface SignUpProps
  extends Pick<
    User & UserProfifle,
    "username" | "password" | "email" | "firstName" | "lastName"
  > {}

export interface SendCodeProps
  extends Pick<UserVerification, "id" | "userId"> {}

export interface VerifyCodeProps
  extends Pick<UserVerification, "id" | "code" | "userId"> {}

export const SendCodeSchema = Joi.object<SendCodeProps>().keys({
  id: Joi.string().required(),
  userId: Joi.string().required(),
});

export const VerifyCodeSchema = Joi.object<VerifyCodeProps>().keys({
  id: Joi.string().required(),
  code: Joi.string().required(),
  userId: Joi.string().required(),
});

export const SignInSchema = Joi.object<SignInProps>().keys({
  username: Joi.string().alphanum().required(),
  email: Joi.string().email().required(),
  password: Joi.string().regex(passwordRegex).required(),
  method: Joi.string().valid("email", "username").required(),
});

export const SignUpSchema = Joi.object<SignUpProps>().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().regex(passwordRegex).required(),
});
