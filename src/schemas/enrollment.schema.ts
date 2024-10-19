import {
  UpdateEnrollmentProps,
  UpdateLessonProgessProp,
  UpdateModuleProgessProp,
} from "@/types/enrollment";
import Joi from "joi";

export const UpdateEnrollmentSchema = Joi.object<UpdateEnrollmentProps>().keys({
  status: Joi.string()
    .valid("IN_PROGRESS", "COMPLETED", "CANCELLED")
    .optional(),
  feedback: Joi.string().min(10).optional(),
});

export const UpdateLessonProgressSchema =
  Joi.object<UpdateLessonProgessProp>().keys({
    lessonId: Joi.string().required(),
  });

export const UpdateModuleProgressSchema =
  Joi.object<UpdateModuleProgessProp>().keys({
    moduleId: Joi.string().required(),
  });
