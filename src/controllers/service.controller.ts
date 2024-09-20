import { CustomError, envConfig } from "@/configs";
import * as otherService from "@/services/other.service";
import { CustomRequest } from "@/types/request";
import { EmailServiceProps } from "@/types/service";
import { generateMailOptions } from "@/utils/mail";
import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const sendEmail = async (
  req: CustomRequest<EmailServiceProps>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, name } = req.body;
    const mailOptions = generateMailOptions({
      receiverEmail: email,
      subject: `Testing nodemailer - ${envConfig.NAME}`,
      template: "test-email",
      context: {
        name: name,
      },
    });
    await otherService.sendEmail(mailOptions);
    res.status(StatusCodes.OK).json({
      message: `Email sent successfully to ${email}`,
      status: "success",
    });
  } catch (error) {
    next(
      new CustomError(
        `Failed to send email -> ${error}`,
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
};
