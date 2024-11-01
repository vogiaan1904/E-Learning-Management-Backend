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
    .on("connect", async () => {
      logger.info(`${envConfig.NAME} redis is connected`);
      // try {
      //   // Configure keyspace events
      //   await redis.sendCommand([
      //     "CONFIG",
      //     "SET",
      //     "notify-keyspace-events",
      //     "Ex",
      //   ]);
      //   logger.info("Keyspace events configured");

      //   // Subscribe to expiration events
      //   redis.subscribe("__keyevent@0__:expired", (key) => {
      //     logger.info(`Session expired for key: ${key}`);
      //   });
      // } catch (err) {
      //   logger.error("Failed to configure keyspace events", err);
      // }
    })
    .connect();
};
