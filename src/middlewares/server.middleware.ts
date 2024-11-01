import { envConfig } from "@/configs";
import { loggerMiddleware } from "@/middlewares/logger.middleware";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import session from "express-session";
import helmet from "helmet";
import { StatusCodes } from "http-status-codes";
import passport from "passport";
import RedisStore from "connect-redis";
import { redis } from "@/database/redis.db";
export const enableServerMiddleware = (server: Express) => {
  // Middlewares
  server.use(cors());
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(cookieParser());
  server.use(
    session({
      store: new RedisStore({
        client: redis,
        ttl: 86400, // Set TTL to 1 day (in seconds)
      }),
      resave: false,
      saveUninitialized: false,
      secret: envConfig.SESSION_SECRET,
      cookie: {
        maxAge: 86400 * 1000, // Cookie expiration in ms (1 day)
        secure: true, // Use secure cookies in production with HTTPS
      },
    }),
  );
  server.use(helmet());
  server.use(loggerMiddleware);
  server.use(passport.initialize());
  server.use(passport.session());
};

export const isServerRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { host } = req.headers;
    if (host && host.includes(`localhost:${envConfig.PORT}`)) {
      return res.status(StatusCodes.OK).json({
        ...req.user,
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};
