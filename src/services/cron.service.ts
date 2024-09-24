import logger from "@/configs/logger.config";
import userService from "@/services/user.service";
import { formatDateTime } from "@/utils/date";
import cron from "node-cron";

export const checkExpiredUserVerification = async () => {
  const now = new Date();
  logger.info(
    `Checking for expired user verification at ${formatDateTime(now)}`,
  );
  const deletedUserVerifications = await userService.deleteUserVerifications({
    expiredAt: {
      lt: now.toISOString(),
    },
  });
  logger.info(
    `Deleted ${deletedUserVerifications.count} expired user verification at ${formatDateTime(now)}`,
  );
};

export const startCronJobs = () => {
  cron.schedule("*/5 * * * *", () => checkExpiredUserVerification());
};
