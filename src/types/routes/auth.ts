import { DefaultRouteProps } from "@/types/routes/default";

interface AuthRouteProps extends DefaultRouteProps {
  signUp: string;
  signIn: string;
  sendCode: string;
  verifyCode: string;
  refreshToken: string;
  signOut: string;
  forgotPassword: string;
  resetPasssword: string;
  googleSignIn: string;
  googleCallbackUrl: string;
  facebookSignIn: string;
  facebookCallbackUrl: string;
}

export const authRoute: AuthRouteProps = {
  index: "/auth",
  default: "/",
  status: "/api-status",
  signUp: "/signup",
  signIn: "/signin",
  sendCode: "/validation/send",
  verifyCode: "/validation/verify",
  refreshToken: "/refresh-token",
  signOut: "/signout",
  forgotPassword: "/forgot-password",
  resetPasssword: "/reset-password",
  googleSignIn: "/google",
  googleCallbackUrl: "/google/callback",
  facebookSignIn: "/facebook",
  facebookCallbackUrl: "/facebook/callback",
};
