import { envConfig } from "@/configs";
import logger from "@/configs/logger.config";
import { CustomTokenProps, JwtFieldProps, TokenType } from "@/types/token";
import { removeFieldsFromObject } from "@/utils/object";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

class TokenService {
  constructor() {}

  generateVerificationCode = (codeLength = 6) => {
    const code = Array.from({ length: codeLength }, () =>
      Math.floor(Math.random() * 10),
    ).join("");
    return code;
  };

  verifyToken = <T extends object | JwtPayload>(
    token: string,
    secretKey: string,
  ): T => {
    return jwt.verify(token, secretKey) as T;
  };

  getResetPasswordToken = async (fields: JwtFieldProps) => {
    try {
      const { tokenId } = fields;
      const token = await this.generateJwtToken(fields, "rpt");
      return {
        token,
        tokenId,
      };
    } catch (error) {
      logger.error(error);
      throw new Error(String(error));
    }
  };
  getJwtTokens = async (fields: JwtFieldProps) => {
    try {
      const { tokenId } = fields;
      const [accessToken, refreshToken] = await Promise.all([
        this.generateJwtToken(fields, "at"),
        this.generateJwtToken(fields, "rt"),
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

  generateJwtToken = async (
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
          : tokenType === "rt"
            ? envConfig.REFRESH_TOKEN_SECRET
            : envConfig.RESET_PASSWORD_TOKEN_SECRET;
      const expiresIn =
        customExpiresIn ||
        (tokenType === "at"
          ? envConfig.ACCESS_TOKEN_EXPIRED
          : tokenType === "rt"
            ? envConfig.REFRESH_TOKEN_EXPIRED
            : envConfig.RESET_PASSWORD_TOKEN_EXPIRED);
      return jwt.sign(payload, secret, {
        expiresIn: expiresIn,
      });
    } catch (error) {
      logger.error(error);
      throw new Error(String(error));
    }
  };

  generateCustomToken = async <T extends CustomTokenProps>(
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

  generateUserSessionKey = (id: string) => {
    return `user-session:${id}`;
  };

  generateResetPasswordKey = (tokenId: string) => {
    return `reset-password:${tokenId}`;
  };
}

export default new TokenService();
