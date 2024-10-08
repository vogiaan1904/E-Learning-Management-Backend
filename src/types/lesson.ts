import { Lesson } from "@prisma/client";
import { OmitAndPartial } from "./object";

export interface CreateLessonProps
  extends Pick<Lesson, "name" | "description" | "position" | "content"> {}

export interface UpadteLessonProps
  extends OmitAndPartial<Lesson, "id" | "moduleId"> {}
