import { CreateQuizzProps, UpdateQuizzProps } from "@/types/quizz";
import Joi from "joi";

export const CreateQuizzSchema = Joi.object<CreateQuizzProps>({
  moduleId: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  timeLimit: Joi.number().required(),
});

export const UpdateQuizzSchema = Joi.object<UpdateQuizzProps>({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  timeLimit: Joi.number().optional(),
});
