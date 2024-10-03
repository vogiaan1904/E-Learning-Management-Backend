import { CreateCourseProps, GetCoursesProps } from "@/types/course";
import Joi from "joi";

export const CreateCourseSchema = Joi.object<CreateCourseProps>().keys({
  teacherId: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  categories: Joi.array().items(Joi.string()).optional(),
});
export const courseQuerySchema = Joi.object<GetCoursesProps>({
  teacherId: Joi.string().uuid().optional(),
  category: Joi.string().optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  skip: Joi.number().integer().min(0).optional(),
});
