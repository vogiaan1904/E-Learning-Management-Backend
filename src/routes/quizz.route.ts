import { routesConfig } from "@/configs";
import quizzController from "@/controllers/quizz.controller";
import { accessTokenMiddleware, userRoleMiddleware } from "@/middlewares";
import { Role } from "@prisma/client";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router({ mergeParams: true });
const { quizzRoute } = routesConfig;
router.get(quizzRoute.status, (req: Request, res: Response) => {
  console.log(req.params);
  res.status(StatusCodes.OK).json({
    message: "Quizz APIs",
    status: "success",
  });
});

router.use(accessTokenMiddleware);

router.post(
  quizzRoute.createQuizz,
  userRoleMiddleware(Role.teacher),
  quizzController.createQuizz,
);

router.get(quizzRoute.getQuizz, quizzController.getQuizz);

router.get(quizzRoute.getQuizzes, quizzController.getQuizzes);

router.patch(
  quizzRoute.updateQuizz,
  userRoleMiddleware(Role.teacher),
  quizzController.updateQuizz,
);

router.delete(
  quizzRoute.deleteQuizz,
  userRoleMiddleware(Role.teacher),
  quizzController.deleteQuizz,
);

export const quizzApis = router;
