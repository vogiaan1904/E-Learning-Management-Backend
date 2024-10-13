import {
  CreateLessonProps,
  GetLessonsProp,
  UpadteLessonProps,
} from "@/types/lesson";
import Joi from "joi";

export const CreateLessonSchema = Joi.object<CreateLessonProps>().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  position: Joi.number().greater(0).required(),
  content: Joi.object().optional(),
});
export const GetLessonsQuerySchema = Joi.object<GetLessonsProp>().keys({
  moduleId: Joi.string().optional(),
});
export const UpdateLessonSchema = Joi.object<UpadteLessonProps>().keys({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  position: Joi.number().greater(0).optional(),
  content: Joi.object().optional(),
});
