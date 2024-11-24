import firebaseAdmin from "@/configs/firebase.config";
import { TokenMessage } from "firebase-admin/lib/messaging/messaging-api";

const messaging = firebaseAdmin.messaging();

export const sendToOneToken = async (
  content: { [key: string]: string },
  token: string,
) => {
  const message: TokenMessage = {
    data: content,
    token: token,
  };
  return await messaging.send(message);
};
