import { Quizz } from "@prisma/client";
import { OmitAndPartial } from "./object";

export interface CreateQuizzProps
  extends Pick<
    Quizz,
    "name" | "moduleId" | "description" | "position" | "timeLimit"
  > {}

export interface UpdateQuizzProps
  extends OmitAndPartial<
    Quizz,
    "id" | "moduleId" | "createdAt" | "updatedAt"
  > {}
