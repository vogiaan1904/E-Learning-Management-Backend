import {
  SendCodeProps,
  SignInProps,
  SignUpProps,
  VerifyCodeProps,
} from "@/types/auth";
import { passwordRegex } from "@/types/regex";
import { AccessTokenProps, RefreshTokenProps } from "@/types/token";
import Joi from "joi";

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

export const RefreshTokenSchema = Joi.object<RefreshTokenProps>().keys({
  sub: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().required(),
  tokenId: Joi.string().required(),
  iat: Joi.number(),
  exp: Joi.number(),
});

export const AccessTokenSchema = Joi.object<AccessTokenProps>().keys({
  sub: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().required(),
  iat: Joi.number(),
  exp: Joi.number(),
});
