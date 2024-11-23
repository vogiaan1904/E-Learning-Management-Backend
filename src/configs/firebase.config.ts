import admin, { ServiceAccount } from "firebase-admin";
import { envConfig } from "./env.config";

const serviceAccount: ServiceAccount = {
  projectId: envConfig.FIREBASE_PROJECT_ID,
  privateKey: envConfig.FIREBASE_PRIVATE_KEY,
  clientEmail: envConfig.FIREBASE_CLIENT_EMAIL,
};
console.log(serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
