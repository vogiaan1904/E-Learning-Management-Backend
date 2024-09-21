import { CustomError, envConfig, routesConfig } from "@/configs";
import logger from "@/configs/logger.config";
import { connectMultipleDB } from "@/database/connect.db";
import { executePrescriptDB } from "@/database/script.db";
import { errorMiddleware, loggerMiddleware } from "@/middlewares";
import { apis } from "@/routes";
import { handleServerShutDown } from "@/utils/server";
import { swaggerSpec } from "@/utils/swagger";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import helmet from "helmet";
import { StatusCodes } from "http-status-codes";
import path from "path";
import swaggerUi from "swagger-ui-express";
dotenv.config({
  path: [".env", ".env.development", ".env.production"],
});

const server = express();

// Middlewares
server.set("views", path.join(__dirname, "templates"));
server.set("view engine", "hbs");
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(helmet());
server.use(loggerMiddleware);

// Routers
server.get(routesConfig.landingPage, (req: Request, res: Response) => {
  res.render("home", {
    name: envConfig.NAME,
  });
});
server.use(
  routesConfig.swagger.docs,
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true }),
);
server.get(routesConfig.swagger.json, (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json(swaggerSpec);
});
server.use(routesConfig.apis, apis);
server.all("*", () => {
  throw new CustomError(
    "Not found operation on this route",
    StatusCodes.NOT_FOUND,
  );
});

// Error middleware must always be the last middleware
server.use(errorMiddleware);

const startServer = () => {
  return server.listen(envConfig.PORT, () => {
    logger.info(`Server is running on http://localhost:${envConfig.PORT}`);
    logger.info(
      `Swagger Docs is avaliable at http://localhost:${envConfig.PORT}/docs`,
    );
  });
};

// Connect to db and start the server
const main = () => {
  connectMultipleDB();
  executePrescriptDB();
  const server = startServer();
  // Handle server shutdown
  if (envConfig.NODE_ENV === "production") {
    process.on("SIGINT", () => handleServerShutDown(server));
    process.on("SIGTERM", () => handleServerShutDown(server));
  }
};

main();
