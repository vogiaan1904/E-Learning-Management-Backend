import { Lesson, Prisma } from "@prisma/client";
import { OmitAndPartial } from "./object";

export interface CreateLessonProps
  extends Pick<
    Lesson,
    "name" | "description" | "position" | "content" | "moduleId"
  > {}

export interface UpadteLessonProps
  extends OmitAndPartial<Lesson, "id" | "moduleId" | "content"> {}

export interface GetLessonsProp extends Pick<Lesson, "moduleId"> {}

export interface UpdateLessonContent {
  content: Prisma.InputJsonValue;
}
