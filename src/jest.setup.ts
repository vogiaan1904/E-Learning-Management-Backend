// src/jest.setup.ts
import { connectMultipleDB, prisma } from "@/database/connect.db";
import { connectToRedis, redis } from "@/database/redis.db";
import {
  executePrescriptDB,
  executePrescriptRedis,
} from "@/database/script.db";

// Load environment variables for testing
import dotenv from "dotenv";
import path from "path";

// Resolve the absolute path to the .env file located at the project root
const envPath = path.resolve(__dirname, `../.env.test`);
// Load environment variables from the resolved .env file
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
});

// Disconnect from databases after all tests have run
afterAll(async () => {
  await prisma.$disconnect();
  await redis.disconnect();
});

// Optional: Reset database state before each test
beforeEach(async () => {
  await prisma.user.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.quizz.deleteMany();
  // Add more deletions as needed for other models
});

// Optional: Additional cleanup after each test
afterEach(async () => {
  // Implement if needed
});
