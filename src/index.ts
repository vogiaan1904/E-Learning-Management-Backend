import "@/configs/loadEnv";
import { CustomError, envConfig, routesConfig } from "@/configs";
import logger from "@/configs/logger.config";
import "@/configs/passport.config";
import { connectMultipleDB } from "@/database/connect.db";
import { connectToRedis } from "@/database/redis.db";
import {
  executePrescriptDB,
  executePrescriptRedis,
} from "@/database/script.db";
import { errorMiddleware } from "@/middlewares";
import { enableServerMiddleware } from "@/middlewares/server.middleware";
import { apis } from "@/routes";
import { startCronJobs } from "@/services/cron.service";
import { handleServerShutDown } from "@/utils/server";
import { swaggerSpec } from "@/utils/swagger";
import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import path from "path";
import swaggerUi from "swagger-ui-express";

// const a = "teacher";
// console.log(prisma[a]);
const server = express();

// Views
server.set("views", path.join(__dirname, "templates"));
server.set("view engine", "hbs");

// Middlewares
enableServerMiddleware(server);

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
    startCronJobs();
  });
};

// Connect to db and start the server
const main = async () => {
  const promises = [
    connectMultipleDB(),
    connectToRedis(),
    executePrescriptDB(),
    executePrescriptRedis(),
  ];
  await Promise.all(promises);
  const server = startServer();
  // Handle server shutdown
  if (envConfig.NODE_ENV === "production") {
    process.on("SIGINT", async () => await handleServerShutDown(server));
    process.on("SIGTERM", async () => await handleServerShutDown(server));
  }
};

main();
