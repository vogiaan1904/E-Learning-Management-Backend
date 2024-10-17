import {
  CreateQuestionProps,
  GetQuestionsProp,
  UpdateQuestionProps,
} from "@/types/question";
import Joi from "joi";

export const CreateQuestionSchema = Joi.object<CreateQuestionProps>().keys({
  content: Joi.string().required(),
  options: Joi.object().required(),
  quizzId: Joi.string().required(),
});

export const GetQuestionsQuerySchema = Joi.object<GetQuestionsProp>().keys({
  quizzId: Joi.string().optional(),
});

export const UpdateQuestionSchema = Joi.object<UpdateQuestionProps>().keys({
  content: Joi.string().optional(),
  options: Joi.object().optional(),
  position: Joi.number().greater(0).optional(),
});
