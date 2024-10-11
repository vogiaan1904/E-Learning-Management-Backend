import { Role, User, UserProfifle } from "@prisma/client";
import { OmitAndPartial } from "./object";

export interface CreateUserProps {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  role: Role;
}
export interface CreateUsersProps {
  data: Array<CreateUserProps>;
}
export interface UpdateUserProfileProps
  extends OmitAndPartial<UserProfifle, "createdAt" | "id"> {}

export interface DeleteUsersProps {
  ids: Array<User["id"]>;
}
export interface UserPayload extends Pick<User, "id" | "email" | "role"> {}
