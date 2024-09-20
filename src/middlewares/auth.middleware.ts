import { CustomError, envConfig } from "@/configs";
import * as userService from "@/services/user.service";
import { SignInProps } from "@/types/auth";
import { CustomRequest } from "@/types/request";
import { AccessTokenProps, RefreshTokenProps } from "@/types/token";
import { verifyToken } from "@/utils/jwt";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

// Prioritize logging in by email
export const preSignInMiddleware = (
  req: CustomRequest<SignInProps>,
  res: Response,
  next: NextFunction,
) => {
  const { email, username } = req.body;
  if (!email) {
    req.body.email = `fakeemail${uuidv4()}@mail.com`;
  }
  if (!username) {
    req.body.username = `fakeusername${uuidv4().replace(/-/g, "")}`;
  }
  req.body.method = email ? "email" : "username";
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
    const foundUser = await userService.getUser(
      {
        id: data.id,
      },
      { type: "id" },
    );
    if (!foundUser) {
      throw new CustomError("User not found", StatusCodes.NOT_FOUND);
    }
    _.merge(req, { auth: data });
    next();
  } catch (error) {
    next(error);
  }
};
