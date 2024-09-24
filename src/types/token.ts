import { User } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

export type TokenType = "at" | "rt";

export interface AccessTokenProps
  extends Pick<User, "email" | "role">,
    JwtPayload {
  sub: string;
}

export interface RefreshTokenProps
  extends Pick<User, "email" | "role">,
    JwtPayload {
  sub: string;
  tokenId: string;
}

export interface JwtFieldProps extends Pick<User, "id" | "email" | "role"> {
  tokenId: string;
}

export interface CustomTokenProps extends Pick<User, "id"> {}
