import { CreateModuleProps, UpadteModuleProps } from "@/types/module";
import Joi from "joi";

export const CreateModuleSchema = Joi.object<CreateModuleProps>().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  position: Joi.number().greater(0).required(),
});
export const UpdateModuleSchema = Joi.object<UpadteModuleProps>().keys({
  name: Joi.string(),
  description: Joi.string(),
  position: Joi.number().greater(0),
});
