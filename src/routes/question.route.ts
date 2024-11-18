import { routesConfig } from "@/configs";
import questionController from "@/controllers/question.controller";
import { accessTokenMiddleware, userRoleMiddleware } from "@/middlewares";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { Role } from "@prisma/client";
import { dataValidation } from "@/validations/data.validation";
import {
  CreateQuestionSchema,
  GetQuestionsQuerySchema,
  UpdateQuestionSchema,
} from "@/schemas/question.schema";

const router = Router({ mergeParams: true });
const { questionRoute } = routesConfig;

router.get(questionRoute.status, (req: Request, res: Response) => {
  console.log(req.params);
  res.status(StatusCodes.OK).json({
    message: "Question APIs",
    status: "success",
  });
});

router.use(accessTokenMiddleware);

router.post(
  questionRoute.createQuestion,
  userRoleMiddleware(Role.teacher, Role.admin),
  dataValidation(CreateQuestionSchema),
  questionController.createQuestion,
);

router.get(questionRoute.getQuestion, questionController.getQuestionbyId);

router.get(
  questionRoute.getQuestions,
  dataValidation(GetQuestionsQuerySchema),
  questionController.getQuestions,
);

router.patch(
  questionRoute.updateQuestion,
  userRoleMiddleware(Role.teacher, Role.admin),
  dataValidation(UpdateQuestionSchema),
  questionController.updateQuestion,
);

router.delete(
  questionRoute.deleteQuestion,
  userRoleMiddleware(Role.teacher, Role.admin),
  questionController.deleteQuestion,
);

export const questionApis = router;
