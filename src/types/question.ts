import { Question } from "@prisma/client";
import { OmitAndPartial } from "./object";
import { Prisma } from "@prisma/client";

export interface CreateQuestionProps
  extends Pick<
    Question,
    "content" | "correctOption" | "wrongOptions" | "quizzId"
  > {}

export interface UpdateQuestionProps
  extends OmitAndPartial<
    Question,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "quizzId"
    | "correctOption"
    | "wrongOptions"
  > {
  correctOption?: Prisma.InputJsonValue;
  wrongOptions?: Prisma.InputJsonValue;
}
