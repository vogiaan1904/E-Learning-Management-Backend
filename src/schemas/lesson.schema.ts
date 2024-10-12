import { CreateLessonProps, UpadteLessonProps } from "@/types/lesson";
import Joi from "joi";

export const CreateLessonSchema = Joi.object<CreateLessonProps>().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  position: Joi.number().greater(0).required(),
  content: Joi.object(),
});

export const UpdateLessonSchema = Joi.object<UpadteLessonProps>().keys({
  name: Joi.string(),
  description: Joi.string(),
  position: Joi.number().greater(0),
});
