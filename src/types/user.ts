import { Role, User, UserProfifle } from "@prisma/client";

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
export interface UpdateUserProfileProps extends Partial<UserProfifle> {}

export interface DeleteUsersProps {
  ids: Array<User["id"]>;
}
