import { CreateCourseProps } from "@/types/course";
import Joi from "joi";

export const CreateCourseSchema = Joi.object<CreateCourseProps>()
  .keys({
    teacherId: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
  })
  .min(1);
