import { envConfig } from "@/configs/env.config";
import nodemailer from "nodemailer";
import hbs, {
  NodemailerExpressHandlebarsOptions,
} from "nodemailer-express-handlebars";

export const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: envConfig.NODEMAILER_USER,
    pass: envConfig.NODEMAILER_PASS,
  },
});

const hbsOptions: NodemailerExpressHandlebarsOptions = {
  viewEngine: {
    defaultLayout: false,
  },
  viewPath: "src/templates",
  extName: ".hbs",
};

mailTransporter.use("compile", hbs(hbsOptions));
