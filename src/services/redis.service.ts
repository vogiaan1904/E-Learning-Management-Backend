import logger from "@/configs/logger.config";
import { redis } from "@/database/redis.db";

class RedisService {
  private readonly redisClient;

  constructor() {
    this.redisClient = redis;
  }

  async setKey(key: string, value: string, expiresIn?: number) {
    if (expiresIn) {
      await this.redisClient.set(key, value, { EX: expiresIn });
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async getKey(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async deleteKey(key: string) {
    await this.redisClient.del(key);
  }

  async getTTL(key: string): Promise<number> {
    return await this.redisClient.ttl(key);
  }

  async monitorSessions() {
    const keys = await this.redisClient.keys("sess:*");
    for (const key of keys) {
      const ttl = await this.getTTL(key);
      logger.info(`TTL for ${key} is ${ttl} seconds`);
    }
  }
}
export default new RedisService();
