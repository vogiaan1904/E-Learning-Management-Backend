import { DefaultRouteProps } from "@/types/routes/default";

interface AuthRouteProps extends DefaultRouteProps {
  signUp: string;
  signIn: string;
  sendCode: string;
  verifyCode: string;
  signOut: string;
  deleteAccount: string;
  recoverAccount: string;
  forgetCredential: string;
}

export const authRoute: AuthRouteProps = {
  index: "/auth",
  default: "/",
  status: "/api-status",
  signUp: "/signup",
  signIn: "/signin",
  sendCode: "/validation/send",
  verifyCode: "/validation/verify",
  signOut: "/signout",
  deleteAccount: "/delete",
  recoverAccount: "/recover",
  forgetCredential: "/forget",
};
