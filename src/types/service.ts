import Joi from "joi";

export interface EmailServiceProps {
  name: string;
  email: string;
}

export const EmailServiceSchema = Joi.object<EmailServiceProps>().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
});
