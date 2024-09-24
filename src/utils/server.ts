import { envConfig } from "@/configs";
import logger from "@/configs/logger.config";
import { disconnectMultipleDB } from "@/database/connect.db";
import { format } from "date-fns";
import fs from "fs";
import { IncomingMessage, Server, ServerResponse } from "http";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const handleServerShutDown = async (
  server: Server<typeof IncomingMessage, typeof ServerResponse>,
) => {
  await disconnectMultipleDB();
  server.close(() => {
    logger.info("Server shut down");
  });
  process.exit(0);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleChangeLogFileName = () => {
  const timestamp = format(new Date(), "ddMMyyyy_HHmmss");
  const newLogFilename = envConfig.LOG_FILE.replace(
    ".log",
    `_${timestamp}_${uuidv4()}.log`,
  );
  const oldLogPath = path.join(__dirname, "../logs", envConfig.LOG_FILE);
  const newLogPath = path.join(__dirname, "../logs", newLogFilename);
  fs.rename(oldLogPath, newLogPath, (err) => {
    if (err) {
      logger.error(`Error renaming log file ${oldLogPath} -> ${newLogPath}`);
    } else {
      logger.info(`Log file renamed to ${newLogFilename}`);
    }
  });
};
