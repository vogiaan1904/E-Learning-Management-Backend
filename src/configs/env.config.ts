export const envConfig = {
  // Server
  NAME: "E Learning Platform Backend",
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",

  HOST: process.env.HOST || "localhost",

  BASE_URL:
    process.env.BASE_URL || `http://localhost:${process.env.PORT || 8000}`,

  LOG_FILE: "server_info.log",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",

  APIS: process.env.APIS || "/api/v1",

  SESSION_SECRET: process.env.SESSION_SECRET || "session-secret",

  // Secret keys
  ACCESS_TOKEN_SECRET:
    process.env.ACCESS_TOKEN_SECRET || "express-typescript-template-backend-at",
  ACCESS_TOKEN_EXPIRED: process.env.ACCESS_TOKEN_EXPIRED || "30m", // 30 mins
  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_SECRET ||
    "express-typescript-template-backend-rt",
  REFRESH_TOKEN_EXPIRED: process.env.REFRESH_TOKEN_EXPIRED || "1d", // 1 day

  // Models
  PERMISSION_USER_NAME: "user",
  PERMISSION_ADMIN_NAME: "admin",
  PERMISSION_GROUP_USER_NAME: "Users",
  PERMISSION_GROUP_ADMIN_NAME: "Admin",

  // Database
  DB_URL: process.env.DATABASE_URL || "db_url",
  DIRECT_URL: process.env.DIRECT_URL || "direct_url",
  DB_NAME: process.env.POSTGRES_DB || "db_name",
  DB_USER: process.env.POSTGRES_USER || "db_user",
  DB_PASSWORD: process.env.POSTGRES_PASSWORD || "db_password",
  DB_HOST: process.env.POSTGRES_HOST || "db_host",
  DB_PORT: Number(process.env.POSTGRES_PORT) || 5432,

  // Redis
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6380,
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6380/0",
  // Email Service
  NODEMAILER_USER:
    process.env.NODEMAILER_USER || "acusvncodingprojects@gmail.com",
  NODEMAILER_PASS: process.env.NODEMAILER_PASS,
  NODEMAILER_DEFAULT_SENDER:
    process.env.NODEMAILER_USER || "acusvncodingprojects@gmail.com",
  NODEMAILER_DEFAULT_RECEIVER: "acuscodinghcm@gmail.com",

  // Google OAuth 2.0
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "google-client-id",
  GOOGLE_CLIENT_SECRET:
    process.env.GOOGLE_CLIENT_SECRET || "google-client-secret",
  GOOGLE_DIRECT_URL: process.env.GOOGLE_DIRECT_URL || "google-direct-url",

  // Facebook Auth
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID || "facebook-client-id",
  FACEBOOK_CLIENT_SECRET:
    process.env.FACEBOOK_CLIENT_SECRET || "facebook-client-secret",
  FACEBOOK_DIRECT_URL: process.env.FACEBOOK_DIRECT_URL || "facebook-direct-url",
};
