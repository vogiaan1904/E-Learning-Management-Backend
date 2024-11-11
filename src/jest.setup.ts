// src/jest.setup.ts
import { connectMultipleDB, prisma } from "@/database/connect.db";
import { connectToRedis, redis } from "@/database/redis.db";
import {
  executePrescriptDB,
  executePrescriptRedis,
} from "@/database/script.db";

import dotenv from "dotenv";
import path from "path";
import logger from "./configs/logger.config";

const envPath = path.resolve(__dirname, `../.env.test`);

dotenv.config({
  path: envPath,
});

console.log(envPath);

// Connect to databases before running tests
beforeAll(async () => {
  await connectMultipleDB();
  await connectToRedis();
  await executePrescriptDB();
  await executePrescriptRedis();
  try {
    await redis.flushDb();
    logger.info("Flushed Redis database.");

    const tableNames = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `;

    for (const { tablename } of tableNames) {
      if (tablename !== "_prisma_migrations") {
        await prisma.$executeRawUnsafe(
          `TRUNCATE TABLE "${tablename}" RESTART IDENTITY CASCADE;`,
        );
      }
    }
  } catch (error) {
    logger.error("Error during test setup:", error);
    throw error;
  }
});

// Disconnect from databases after all tests have run
afterAll(async () => {
  try {
    await redis.disconnect();
    logger.info("Disconnected from Redis.");

    await prisma.$disconnect();
    logger.info("Disconnected from PostgreSQL.");
  } catch (error) {
    logger.error("Error during teardown:", error);
    throw error;
  }
});

// Optional: Reset database state before each test
// beforeEach(async () => {
//   try {
//     await redis.flushDb();
//     logger.info("Flushed Redis database.");

//     const tableNames = await prisma.$queryRaw<{ tablename: string }[]>`
//       SELECT tablename FROM pg_tables WHERE schemaname = 'public'
//     `;

//     for (const { tablename } of tableNames) {
//       if (tablename !== "_prisma_migrations") {
//         await prisma.$executeRawUnsafe(
//           `TRUNCATE TABLE "${tablename}" RESTART IDENTITY CASCADE;`,
//         );
//         // logger.info(`Truncated table: ${tablename}`);
//       }
//     }
//   } catch (error) {
//     logger.error("Error during test setup:", error);
//     throw error;
//   }
// });

// Optional: Additional cleanup after each test
afterEach(async () => {
  // Implement if needed
});
