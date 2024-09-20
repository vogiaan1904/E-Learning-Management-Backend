import logger from "@/configs/logger.config";
import { mailTransporter } from "@/configs/mail.config";

export const sendEmail = async (mailOptions: object) => {
  await mailTransporter.sendMail(mailOptions);
  logger.info("Mail sent successfully");
};
