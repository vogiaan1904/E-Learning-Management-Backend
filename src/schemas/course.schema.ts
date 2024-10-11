import {
  CreateCourseProps,
  GetCoursesProps,
  UpdateCourseProps,
} from "@/types/course";
import Joi from "joi";

export const CreateCourseSchema = Joi.object<CreateCourseProps>().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  categories: Joi.array().items(Joi.string()).optional(),
});
export const CourseQuerySchema = Joi.object<GetCoursesProps>().keys({
  teacherId: Joi.string().uuid().optional(),
  category: Joi.string().optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  skip: Joi.number().integer().min(0).optional(),
});

export const UpdateCourseSchema = Joi.object<UpdateCourseProps>().keys({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  numEnrollments: Joi.number().optional(),
});
