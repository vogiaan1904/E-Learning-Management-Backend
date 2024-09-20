import { envConfig } from "@/configs";
import logger from "@/configs/logger.config";
import { mailTransporter } from "@/configs/mail.config";
import Mail from "nodemailer/lib/mailer";

interface ExtendedMailOptions extends Mail.Options {
  template?: string;
  context?: object;
}

interface GenerateMailOptionsProps {
  receiverEmail: string;
  subject?: string;
  template?: string;
  context?: object;
}

export const sendEmail = async (mailOptions: ExtendedMailOptions) => {
  await mailTransporter.sendMail(mailOptions);
  logger.info("Mail sent successfully");
};

export const generateMailOptions = ({
  receiverEmail,
  subject = "Testing nodemailer",
  template = "TestEmail",
  context = {
    name: "testing123",
  },
}: GenerateMailOptionsProps): ExtendedMailOptions => {
  return {
    from: envConfig.NODEMAILER_DEFAULT_SENDER,
    to: receiverEmail,
    subject: subject,
    template: template,
    context: context,
  };
};
