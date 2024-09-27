import { CustomError, envConfig } from "@/configs";
import tokenService from "@/services/token.service";
import { PreSigninProps, SignInProps } from "@/types/auth";
import { CustomRequest } from "@/types/request";
import { AccessTokenProps, RefreshTokenProps } from "@/types/token";
import { validateEmail } from "@/utils/validate";
import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

// Prioritize signing in by email
export const preSignInMiddleware = (
  req: CustomRequest<PreSigninProps | SignInProps>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { account, password } = req.body as PreSigninProps;
    const isEmail = validateEmail(account);
    const signInProps: SignInProps = {
      email: isEmail ? account : `fakeemail${uuidv4()}@mail.com`,
      username: !isEmail
        ? account
        : `fakeusername${uuidv4().replace(/-/g, "")}`,
      password: password,
      method: isEmail ? "email" : "username",
    };
    req.body = signInProps;
    next();
  } catch (error) {
    next(error);
  }
};

export const refreshTokenMiddleware = async (
  req: CustomRequest<RefreshTokenProps>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new CustomError(
        "Refresh token is missing",
        StatusCodes.BAD_REQUEST,
      );
    }
    const data = tokenService.verifyToken<RefreshTokenProps>(
      refreshToken,
      envConfig.REFRESH_TOKEN_SECRET,
    );
    req.user = data;
    next();
  } catch (error) {
    next(error);
  }
};

export const accessTokenMiddleware = async (
  req: CustomRequest<AccessTokenProps>,
  res: Response,
  next: NextFunction,
) => {
  try {
    let accessToken;
    const authHeader = req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer")) {
      accessToken = authHeader.replace("Bearer ", "");
    } else {
      throw new CustomError("Access token is missing", StatusCodes.BAD_REQUEST);
    }
    const data = tokenService.verifyToken<AccessTokenProps>(
      accessToken,
      envConfig.ACCESS_TOKEN_SECRET,
    );
    console.log(data);
    req.user = data;
    next();
  } catch (error) {
    next(error);
  }
};
