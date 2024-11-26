/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Question } from "@prisma/client";
import { OmitAndPartial } from "./object";
import { Prisma } from "@prisma/client";

export interface Option {
  option: string;
  isCorrect: boolean;
}
export interface BaseCreateQuestionProps
  extends Pick<Question, "content" | "quizzId" | "options"> {}

export interface BaseUpdateQuestionProps
  extends OmitAndPartial<
    Question,
    "id" | "createdAt" | "updatedAt" | "quizzId" | "options"
  > {
  options?: Prisma.InputJsonValue[];
}

export interface GetQuestionsProp {
  quizzId?: string;
}

// interface CreateQuestionPropsWithCorrectAndWrongOptions
//   extends BaseCreateQuestionProps,
//     Pick<Question, "correctOption" | "wrongOptions"> {
//   options?: never;
// }
// interface CreateQuestionPropsWithOptions extends BaseCreateQuestionProps {
//   options: [
//     {
//       option: string;
//       isCorrect: boolean;
//     },
//   ];
//   correctOption?: never;
//   wrongOptions?: never;
// }
// export type CreateQuestionProps =
//   | CreateQuestionPropsWithCorrectAndWrongOptions
//   | CreateQuestionPropsWithOptions;

// // export interface CreateQuestionProps
// //   extends Pick<
// //     Question,
// //     "content" | "correctOption" | "wrongOptions" | "quizzId"
// //   > {}
