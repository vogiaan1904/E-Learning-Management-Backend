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
import { Server } from "http";

// const a = "teacher";
// console.log(prisma[a]);
const app = express();

// Views
app.set("views", path.join(__dirname, "templates"));
app.set("view engine", "hbs");

// Middlewares
enableServerMiddleware(app);

// Routers
app.get(routesConfig.landingPage, (req: Request, res: Response) => {
  res.render("home", {
    name: envConfig.NAME,
  });
});
app.use(
  routesConfig.swagger.docs,
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true }),
);
app.get(routesConfig.swagger.json, (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json(swaggerSpec);
});
app.use(routesConfig.apis, apis);
app.all("*", () => {
  throw new CustomError(
    "Not found operation on this route",
    StatusCodes.NOT_FOUND,
  );
});

// Error middleware must always be the last middleware
app.use(errorMiddleware);

let serverInstance: Server;

const startServer = () => {
  if (!serverInstance) {
    serverInstance = app.listen(Number(envConfig.PORT), "0.0.0.0", () => {
      logger.info(`Server is running on ${envConfig.HOST}`);
      logger.info(`Swagger Docs is available at ${envConfig.HOST}/docs`);
      startCronJobs();
    });
  }
  return serverInstance;
};

// Connect to db and start the server
const main = async () => {
  try {
    console.log(`NODE_ENV: ${envConfig.NODE_ENV}`);
    console.log(`DATABASE_URL: ${envConfig.DB_URL}`);
    const promises = [
      connectMultipleDB(),
      connectToRedis(),
      executePrescriptDB(),
      executePrescriptRedis(),
    ];
    await Promise.all(promises);
    startServer();
    // Handle server shutdown
    if (envConfig.NODE_ENV === "production") {
      process.on(
        "SIGINT",
        async () => await handleServerShutDown(serverInstance),
      );
      process.on(
        "SIGTERM",
        async () => await handleServerShutDown(serverInstance),
      );
    }
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};
if (process.env.NODE_ENV !== "test") {
  main();
}

export { app, startServer };
