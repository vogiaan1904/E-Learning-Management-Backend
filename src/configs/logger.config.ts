import { envConfig } from "@/configs/env.config";
import { formatDate } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import winston, { format, transports } from "winston";

const timestamp = formatDate(new Date(), "ddMMyyyy_HHmmss");

const logger = winston.createLogger({
  level: envConfig.LOG_LEVEL,
  defaultMeta: { service: envConfig.NAME },
  format: format.combine(
    format.metadata(),
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ssA",
    }),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple(),
        format.align(),
        format.printf(({ timestamp, level, message, metadata }) => {
          const { service, ...rest } = metadata;
          return `[${timestamp}] ${uuidv4()} ${service} - ${level} : ${message} ${Object.keys(rest).length > 0 ? `,${JSON.stringify(rest)}` : ""}`;
        }),
      ),
    }),
  ],
});

if (envConfig.NODE_ENV === "production") {
  logger.add(
    new transports.File({
      level: "info",
      dirname: "dist/logs",
      filename: `${timestamp}_${uuidv4()}_${envConfig.LOG_FILE}`,
      format: format.combine(format.json(), format.prettyPrint()),
      maxsize: 1_048_576, // 10mb
    }),
  );
}

export default logger;
