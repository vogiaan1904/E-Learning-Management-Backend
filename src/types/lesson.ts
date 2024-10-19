import { Lesson, Prisma } from "@prisma/client";
import { OmitAndPartial } from "./object";

export interface CreateLessonProps
  extends Pick<Lesson, "name" | "description" | "moduleId" | "content"> {}

export interface UpdateLessonProps
  extends OmitAndPartial<Lesson, "id" | "moduleId" | "content"> {
  content?: Prisma.InputJsonValue;
}

export interface GetLessonsProp {
  moduleId?: string;
}
