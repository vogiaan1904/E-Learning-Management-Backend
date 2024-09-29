import { Role, User, UserProfifle } from "@prisma/client";

export interface CreateUserProps {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  role: Role;
}

export interface GetUserProps extends Pick<User, "email" | "id" | "username"> {}

export interface CreateUsersProps {
  data: Array<CreateUserProps>;
}

export interface DeleteUsersProps {
  ids: Array<User["id"]>;
}
export interface UpdateUsersProps {
  data: Array<User>;
}

export interface UpdateUserProfileProps extends Partial<UserProfifle> {}
