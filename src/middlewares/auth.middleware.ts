import { CustomError, envConfig } from "@/configs";
import { PreSigninProps, SignInProps } from "@/types/auth";
import { CustomRequest } from "@/types/request";
import { AccessTokenProps, RefreshTokenProps } from "@/types/token";
import { verifyToken } from "@/utils/jwt";
import { validateEmail } from "@/utils/validate";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

// Prioritize logging in by email
export const preSignInMiddleware = (
  req: CustomRequest<PreSigninProps | SignInProps>,
  res: Response,
  next: NextFunction,
) => {
  const { account, password } = req.body as PreSigninProps;

  const isEmail = validateEmail(account);
  const signInProps: SignInProps = {
    email: isEmail ? account : `fakeemail${uuidv4()}@mail.com`,
    username: !isEmail ? account : `fakeusername${uuidv4().replace(/-/g, "")}`,
    password: password,
    method: isEmail ? "email" : "username",
  };

  req.body = signInProps;

  next();
};

export const refreshTokenMiddleware = async (
  req: Request,
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
    const data = verifyToken<RefreshTokenProps>(
      refreshToken,
      envConfig.REFRESH_TOKEN_SECRET,
    );
    // const foundToken = await tokenService.getToken(data.tokenId);
    // if (!foundToken) {
    //   throw new CustomError("Refresh token not found", StatusCodes.BAD_REQUEST);
    // }
    _.merge(req, { auth: data });
  } catch (error) {
    next(error);
  }
};

export const accessTokenMiddleware = async (
  req: Request,
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
    const data = verifyToken<AccessTokenProps>(
      accessToken,
      envConfig.ACCESS_TOKEN_SECRET,
    );
    // const foundUser = await userService.getUser(
    //   {
    //     id: data.id,
    //   },
    //   { type: "id" },
    // );
    // if (!foundUser) {
    //   throw new CustomError("User not found", StatusCodes.NOT_FOUND);
    // }
    _.merge(req, { auth: data });
    next();
  } catch (error) {
    next(error);
  }
};
