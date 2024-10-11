import { Module } from "@prisma/client";
import { OmitAndPartial } from "./object";

export interface CreateModuleProps
  extends Pick<Module, "name" | "description" | "position"> {}

export interface UpadteModuleProps
  extends OmitAndPartial<Module, "courseId" | "id" | "createdAt"> {}