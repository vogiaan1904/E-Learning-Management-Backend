import logger from "@/configs/logger.config";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

const clients = [
  {
    client: prisma,
    database_name: "E Learning Management",
  },
];

export const connectMultipleDB = () => {
  clients.forEach(({ client, database_name }) =>
    connectToDB(client, database_name),
  );
};

export const disconnectMultipleDB = () => {
  clients.forEach(({ client, database_name }) =>
    disconnectToDB(client, database_name),
  );
};

export const connectToDB = (client: PrismaClient, database_name: string) => {
  client
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
