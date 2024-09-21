import "dotenv/config";

export const envConfig = {
  // Server
  NAME: "E Learning Management Backend",
  PORT: process.env.PORT || 3000,
  LOG_FILE: "server_info.log",
  NODE_ENV: process.env.NODE_ENV || "development",
  APIS: process.env.APIS || "/api/v1",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",

  // Secret keys
  ACCESS_TOKEN_SECRET:
    process.env.ACCESS_TOKEN_SECRET || "e-learning-management-backend-at",
  ACCESS_TOKEN_EXPIRED: process.env.ACCESS_TOKEN_EXPIRED || "30m", // 30 mins
  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_SECRET || "e-learning-management-backend-rt",
  REFRESH_TOKEN_EXPIRED: process.env.REFRESH_TOKEN_EXPIRED || "1d", // 1 day

  // Models
  PERMISSION_USER_NAME: "user",
  PERMISSION_ADMIN_NAME: "admin",
  PERMISSION_GROUP_USER_NAME: "Users",
  PERMISSION_GROUP_ADMIN_NAME: "Admin",

  // Database
  DB_URL: process.env.DATABASE_URL || "db_url",
  DB_NAME: process.env.POSTGRES_DB || "db_name",
  DB_USER: process.env.POSTGRES_USER || "db_user",
  DB_PASSWORD: process.env.POSTGRES_PASSWORD || "db_password",
  DB_HOST: process.env.POSTGRES_HOST || "db_host",
  DB_PORT: Number(process.env.POSTGRES_PORT) || 5432,

  // Email Service
  NODEMAILER_USER:
    process.env.NODEMAILER_USER || "acusvncodingprojects@gmail.com",
  NODEMAILER_PASS: process.env.NODEMAILER_PASS,
  NODEMAILER_DEFAULT_SENDER:
    process.env.NODEMAILER_USER || "acusvncodingprojects@gmail.com",
  NODEMAILER_DEFAULT_RECEIVER: "acuscodinghcm@gmail.com",
};
