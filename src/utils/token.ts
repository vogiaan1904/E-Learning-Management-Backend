import { envConfig } from "@/configs";
import logger from "@/configs/logger.config";
import { CustomTokenProps, JwtFieldProps, TokenType } from "@/types/token";
import { removeFieldsFromObject } from "@/utils/object";
import * as jwt from "jsonwebtoken";

export const generateVerificationCode = (codeLength = 6) => {
  const code = Array.from({ length: codeLength }, () =>
    Math.floor(Math.random() * 10),
  ).join("");
  return code;
};

export const getJwtTokens = async (fields: JwtFieldProps) => {
  try {
    const { tokenId } = fields;
    const [accessToken, refreshToken] = await Promise.all([
      generateJwtToken(fields, "at"),
      generateJwtToken(fields, "rt"),
    ]);
    return {
      accessToken,
      refreshToken,
      tokenId,
    };
  } catch (error) {
    logger.error(error);
    throw new Error(String(error));
  }
};

export const generateJwtToken = async (
  fields: JwtFieldProps,
  tokenType: TokenType,
  customExpiresIn?: string,
) => {
  try {
    const { id, ...rest } = fields;
    const payload = { sub: id, ...rest };
    if (tokenType === "at") {
      removeFieldsFromObject(payload, ["tokenId"]);
    }
    const secret =
      tokenType === "at"
        ? envConfig.ACCESS_TOKEN_SECRET
        : envConfig.REFRESH_TOKEN_SECRET;
    const expiresIn =
      customExpiresIn ||
      (tokenType === "at"
        ? envConfig.ACCESS_TOKEN_EXPIRED
        : envConfig.REFRESH_TOKEN_EXPIRED);
    return jwt.sign(payload, secret, {
      expiresIn: expiresIn,
    });
  } catch (error) {
    logger.error(error);
    throw new Error(String(error));
  }
};

export const generateCustomToken = async <T extends CustomTokenProps>(
  fields: T,
  options: {
    secret: string;
    expiresIn: string;
  },
) => {
  try {
    const { id, ...rest } = fields;
    const payload = { sub: id, ...rest };
    return jwt.sign(payload, options.secret, {
      expiresIn: options.expiresIn,
    });
  } catch (error) {
    logger.error(error);
    throw new Error(String(error));
  }
};
