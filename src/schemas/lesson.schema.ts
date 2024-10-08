import { CreateLessonProps } from "@/types/lesson";
import Joi from "joi";

export const CreateLessonSchema = Joi.object<CreateLessonProps>().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  position: Joi.number().greater(0).required(),
  content: Joi.object(),
});
