import { Question } from "@prisma/client";
import { OmitAndPartial } from "./object";
import { Prisma } from "@prisma/client";

interface BaseCreateQuestionProps
  extends Pick<Question, "content" | "quizzId"> {}
interface CreateQuestionPropsWithCorrectAndWrongOptions
  extends BaseCreateQuestionProps,
    Pick<Question, "correctOption" | "wrongOptions"> {
  options?: never;
}
interface CreateQuestionPropsWithOptions extends BaseCreateQuestionProps {
  options: [
    {
      option: string;
      isCorrect: boolean;
    },
  ];
  correctOption?: never;
  wrongOptions?: never;
}
export type CreateQuestionProps =
  | CreateQuestionPropsWithCorrectAndWrongOptions
  | CreateQuestionPropsWithOptions;

// export interface CreateQuestionProps
//   extends Pick<
//     Question,
//     "content" | "correctOption" | "wrongOptions" | "quizzId"
//   > {}

interface BaseUpdateQuestionProps
  extends OmitAndPartial<
    Question,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "quizzId"
    | "correctOption"
    | "wrongOptions"
  > {}
interface UpdateQuestionWithOptions extends BaseUpdateQuestionProps {
  options: [
    {
      option: string;
      isCorrect: boolean;
    },
  ];
  correctOption?: never;
  wrongOptions?: never;
}
interface UpdateQuestionWithCorrectAndWrongOptions
  extends BaseUpdateQuestionProps {
  options?: never;
  correctOption?: Prisma.InputJsonValue;
  wrongOptions?: Prisma.InputJsonValue;
}
export type UpdateQuestionProps =
  | UpdateQuestionWithCorrectAndWrongOptions
  | UpdateQuestionWithOptions;
export interface GetQuestionsProp {
  quizzId?: string;
}
