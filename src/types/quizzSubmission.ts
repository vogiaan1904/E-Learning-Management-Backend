/* eslint-disable @typescript-eslint/no-empty-object-type */
import { QuizzSubmission } from "@prisma/client";

export interface SubmissionAnswer {
  questionId: string;
  selectedOptions: string[];
}

export interface SubmissionEvaluation {
  questionId: string;
  correct: boolean;
  selectedOptionContents: string[];
  correctOptionContents: string[];
  message?: string;
}

export interface CreateQuizzSubmissionProps
  extends Pick<QuizzSubmission, "quizzId" | "enrollmentId" | "dueAt"> {}

export interface SubmitSubmissionProps {
  submissionAnswers: SubmissionAnswer[];
}
