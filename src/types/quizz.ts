/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Quizz } from "@prisma/client";
import { OmitAndPartial } from "./object";

export interface CreateQuizzProps
  extends Pick<Quizz, "name" | "moduleId" | "description" | "timeLimit"> {}

export interface UpdateQuizzProps
  extends OmitAndPartial<
    Quizz,
    "id" | "moduleId" | "createdAt" | "updatedAt"
  > {}

export interface GetQuizzesProp {
  moduleId?: string;
}
