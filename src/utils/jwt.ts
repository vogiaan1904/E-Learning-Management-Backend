import { envConfig } from "@/configs";
import { TokenType } from "@/types/token";
import jwt, { JwtPayload } from "jsonwebtoken";

export const generateJwtToken = (
  payload: string | object | Buffer,
  tokenType: TokenType,
): string => {
  if (tokenType === "at") {
    return jwt.sign(payload, envConfig.ACCESS_TOKEN_SECRET, {
      expiresIn: envConfig.ACCESS_TOKEN_EXPIRED,
    });
  } else {
    return jwt.sign(payload, envConfig.REFRESH_TOKEN_SECRET, {
      expiresIn: envConfig.REFRESH_TOKEN_EXPIRED,
    });
  }
};

export const verifyToken = <T extends object | JwtPayload>(
  token: string,
  secretKey: string,
): T => {
  return jwt.verify(token, secretKey) as T;
};
