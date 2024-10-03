import logger from "@/configs/logger.config";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

const clients = [
  {
    client: prisma,
    database_name: "E Learning Platform Backend",
  },
];

export const connectMultipleDB = async () => {
  const promises = clients.map(({ client, database_name }) =>
    connectToDB(client, database_name),
  );
  await Promise.all(promises);
};

export const disconnectMultipleDB = async () => {
  const promises = clients.map(({ client, database_name }) =>
    disconnectToDB(client, database_name),
  );
  await Promise.all(promises);
};

export const connectToDB = async (
  client: PrismaClient,
  database_name: string,
) => {
  await client
    .$connect()
    .then(() => {
      logger.info(`${database_name} database is connected`);
    })
    .catch((error: unknown) => {
      logger.error(
        `Failed to connect to database ${database_name.toLowerCase()} -> ${String(error)}`,
      );
      throw new Error(String(error));
    });
};

export const disconnectToDB = (client: PrismaClient, database_name: string) => {
  client
    .$disconnect()
    .then(() => {
      logger.info(`${database_name} database is disconnected`);
    })
    .catch((error: unknown) => {
      logger.error(
        `Failed to connect to database ${database_name.toLowerCase()} -> ${String(error)}`,
      );
      throw new Error(String(error));
    });
};
