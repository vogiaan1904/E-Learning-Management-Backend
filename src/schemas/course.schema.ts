import {
  CreateCourseProps,
  GetCoursesProps,
  UpdateCourseProps,
} from "@/types/course";
import { CreateReviewProps } from "@/types/review";
import Joi from "joi";

export const CreateCourseSchema = Joi.object<CreateCourseProps>().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  teacherId: Joi.string().uuid().required(),
  categories: Joi.array().items(Joi.string()).optional(),
  level: Joi.string().valid("BEGINNER", "INTERMEDIATE", "ADVANCED").required(),
  thumbnailUrl: Joi.string().required(),
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
  level: Joi.string().valid("BEGINNER", "INTERMEDIATE", "ADVANCED").optional(),
  thumbnailUrl: Joi.string().optional(),
});

export const AddReviewSchema = Joi.object<CreateReviewProps>().keys({
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().optional(),
});
