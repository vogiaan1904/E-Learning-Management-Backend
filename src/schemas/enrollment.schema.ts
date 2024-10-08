import { updateEnrollmentProps } from "@/types/enrollment";
import Joi from "joi";

export const UpdateEnrollmentSchema = Joi.object<updateEnrollmentProps>().keys({
  status: Joi.string()
    .valid("IN_PROGRESS", "COMPLETED", "CANCELLED")
    .optional(),
  feedback: Joi.string().min(10).optional(),
});
