import { UpdateReviewProps } from "@/types/review";
import Joi from "joi";

export const UpdateReviewSchema = Joi.object<UpdateReviewProps>().keys({
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().optional(),
});
