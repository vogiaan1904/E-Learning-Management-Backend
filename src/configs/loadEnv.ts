import dotenv from "dotenv";
import path from "path";
const envFile = (() => {
  switch (process.env.NODE_ENV) {
    case "development":
      return ".env";
    case "production":
      return ".env";
    case "test":
      return ".env.test";
    default:
      return ".env";
  }
})();

const envPath = path.resolve(__dirname, `../../${envFile}`);

dotenv.config({
  path: envPath,
});
