import { Module } from "@prisma/client";
import { OmitAndPartial } from "./object";

export interface CreateModuleProps
  extends Pick<Module, "name" | "description" | "courseId"> {}

export interface UpadteModuleProps
  extends OmitAndPartial<Module, "courseId" | "id" | "createdAt"> {}

export interface GetModulesProps {
  courseId?: string;
}
