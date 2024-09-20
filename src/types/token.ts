import { User } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

export type TokenType = "at" | "rt";

export interface AccessTokenProps
  extends Pick<User, "id" | "email" | "role">,
    JwtPayload {}

export interface RefreshTokenProps
  extends Pick<User, "id" | "email" | "role">,
    JwtPayload {
  tokenId: string;
}
