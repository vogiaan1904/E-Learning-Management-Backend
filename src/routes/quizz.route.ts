import { routesConfig } from "@/configs";
import quizzController from "@/controllers/quizz.controller";
import { accessTokenMiddleware, userRoleMiddleware } from "@/middlewares";
import { CreateQuizzSubmissionSchema } from "@/schemas/quizzSubmission.schema";
import { dataValidation } from "@/validations/data.validation";
import { Role } from "@prisma/client";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router({ mergeParams: true });
const { quizzRoute } = routesConfig;
router.get(quizzRoute.status, (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: "Quizz APIs",
    status: "success",
  });
});

router.post(
  quizzRoute.startQuizz,
  accessTokenMiddleware,
  userRoleMiddleware(Role.user),
  quizzController.startQuizz,
);

router.post(
  quizzRoute.createQuizz,
  accessTokenMiddleware,
  userRoleMiddleware(Role.teacher, Role.admin),
  quizzController.createQuizz,
);

router.get(
  quizzRoute.getQuizz,
  accessTokenMiddleware,
  quizzController.getQuizz,
);

router.get(
  quizzRoute.getQuizzes,
  accessTokenMiddleware,
  quizzController.getQuizzes,
);

router.patch(
  quizzRoute.submitQuizz,
  accessTokenMiddleware,
  userRoleMiddleware(Role.user),
  dataValidation(CreateQuizzSubmissionSchema),
  quizzController.submitQuizz,
);

router.patch(
  quizzRoute.updateQuizz,
  accessTokenMiddleware,
  userRoleMiddleware(Role.teacher, Role.admin),
  quizzController.updateQuizz,
);

router.delete(
  quizzRoute.deleteQuizz,
  accessTokenMiddleware,
  userRoleMiddleware(Role.teacher, Role.admin),
  quizzController.deleteQuizz,
);

export const quizzApis = router;
