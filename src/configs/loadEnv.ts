import dotenv from "dotenv";
import path from "path";
const envFile = (() => {
  switch (process.env.NODE_ENV) {
    case "development":
      return ".env.development";
    case "production":
      return ".env.production";
    case "test":
      return ".env.test";
    default:
      return ".env";
  }
})();

// Resolve the absolute path to the .env file located at the project root
const envPath = path.resolve(__dirname, `../../${envFile}`);

// Load environment variables from the resolved .env file
dotenv.config({
  path: envPath,
});
