import { Lesson, Prisma } from "@prisma/client";
import { OmitAndPartial } from "./object";

export interface CreateLessonProps
  extends Pick<
    Lesson,
    "name" | "description" | "position" | "moduleId" | "content"
  > {}

export interface UpadteLessonProps
  extends OmitAndPartial<Lesson, "id" | "moduleId" | "content"> {
  content: Prisma.InputJsonValue;
}

export interface GetLessonsProp {
  moduleId?: string;
}
