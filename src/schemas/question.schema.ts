import {
  BaseCreateQuestionProps,
  BaseUpdateQuestionProps,
  GetQuestionsProp,
} from "@/types/question";
import Joi from "joi";

export const CreateQuestionSchema = Joi.object<BaseCreateQuestionProps>().keys({
  content: Joi.string().required(),
  quizzId: Joi.string().required(),
  options: Joi.array()
    .items(
      Joi.object({
        option: Joi.string().required(),
        isCorrect: Joi.boolean().required(),
      }),
    )
    .required(),
});

export const GetQuestionsQuerySchema = Joi.object<GetQuestionsProp>().keys({
  quizzId: Joi.string().optional(),
});

export const UpdateQuestionSchema = Joi.object<BaseUpdateQuestionProps>().keys({
  content: Joi.string().optional(),
  options: Joi.array()
    .items(
      Joi.object({
        option: Joi.string().required(),
        isCorrect: Joi.boolean().required(),
      }),
    )
    .optional(),
  position: Joi.number().min(0).optional(),
});
