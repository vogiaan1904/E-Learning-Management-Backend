import { envConfig } from "@/configs";
import logger from "@/configs/logger.config";
import { createClient, RedisClientType } from "redis";

class Redis {
  private static instance: RedisClientType | null = null;
  private constructor() {}

  public static getInstance(): RedisClientType {
    if (!Redis.instance) {
      Redis.instance = createClient({
        url: envConfig.REDIS_URL,
      });

      Redis.instance.on("error", (err) =>
        logger.error(`Can not connect to ${envConfig.NAME} redis: ${err}`),
      );
      Redis.instance.on("connect", () => {
        logger.info(`${envConfig.NAME} Redis is connected`);
      });
      Redis.instance.connect().catch((err) => {
        logger.error(`Failed to connect to Redis: ${err}`);
      });
    }
    return Redis.instance;
  }

  public static async disconnect(): Promise<void> {
    if (Redis.instance) {
      try {
        await Redis.instance.quit();
        logger.info(`Disconnected from ${envConfig.NAME} Redis.`);
      } catch (err) {
        logger.error(`Error disconnecting Redis: ${err}`);
      }
      Redis.instance = null;
    }
  }
}
// console.log(envConfig.REDIS_URL);

export const connectToRedis = async (): Promise<void> => {
  try {
    Redis.getInstance();
  } catch (err) {
    logger.error(`Error in connectToRedis: ${err}`);
    throw err;
  }
};

export const redis = Redis.getInstance();
