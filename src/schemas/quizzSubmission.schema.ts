import Joi from "joi";

export interface SubmissionAnswer {
  questionId: string;
  selectedOptions: string[];
}

export interface CreateQuizzSubmissionProps {
  submissionAnswers: SubmissionAnswer[];
}

export const CreateQuizzSubmissionSchema =
  Joi.object<CreateQuizzSubmissionProps>({
    submissionAnswers: Joi.array()
      .items(
        Joi.object<SubmissionAnswer>({
          questionId: Joi.string().uuid().required(),
          selectedOptions: Joi.array()
            .items(Joi.string().required())
            .min(1)
            .required(),
        }),
      )
      .min(1)
      .required(),
  });
