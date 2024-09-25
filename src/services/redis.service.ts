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
}

export default new RedisService();
