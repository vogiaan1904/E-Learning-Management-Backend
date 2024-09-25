import { envConfig } from "@/configs";
import logger from "@/configs/logger.config";
import { createClient } from "redis";

export const redis = createClient({
  url: envConfig.REDIS_URL,
});

export const connectToRedis = async () => {
  await redis
    .on("error", (err) =>
      logger.error(`Can not connect to ${envConfig.NAME} redis: ${err}`),
    )
    .on("connect", () => logger.info(`${envConfig.NAME} redis is connected`))
    .connect();
};
