import { User, UserProfifle, UserVerification } from "@prisma/client";

export interface PreSigninProps extends Pick<User, "password"> {
  account: string;
}

export interface SignInProps
  extends Pick<User, "username" | "password" | "email"> {
  method: string;
}

export interface SignUpProps
  extends Pick<
    User & UserProfifle,
    "username" | "password" | "email" | "firstName" | "lastName" | "role"
  > {}

export interface SendCodeProps
  extends Pick<UserVerification, "id" | "userId"> {}

export interface VerifyCodeProps
  extends Pick<UserVerification, "id" | "code" | "userId"> {}

export interface ForgotPasswordProps extends Pick<User, "email" | "username"> {}

export interface ResetPasswordProps {
  newPassword: string;
}

export interface ResetPasswordQueryProps {
  token?: string;
}

export interface FacebookProfileProps {
  email: string;
  last_name: string;
  first_name: string;
  id: string;
  name: string;
  picture: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
}
