import { GetCoursesProps } from "@/types/course";
import Joi from "joi";

export const courseQuerySchema = Joi.object<GetCoursesProps>({
  teacherId: Joi.string().uuid().optional(),
  category: Joi.string().optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  skip: Joi.number().integer().min(0).optional(),
});
