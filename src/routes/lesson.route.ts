import { routesConfig } from "@/configs";
import lessonController from "@/controllers/lesson.controller";
import { accessTokenMiddleware, userRoleMiddleware } from "@/middlewares";
import { Role } from "@prisma/client";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router({ mergeParams: true });
const { lessonRoute } = routesConfig;

router.get(lessonRoute.status, (req: Request, res: Response) => {
  console.log(req.params);
  res.status(StatusCodes.OK).json({
    message: "Lesson APIs",
    status: "success",
  });
});

router.use(accessTokenMiddleware);

router.post(
  lessonRoute.createLesson,
  userRoleMiddleware(Role.teacher),
  lessonController.createLesson,
);

router.get(lessonRoute.getLessons, lessonController.getLessons);

router.get(lessonRoute.getLesson, lessonController.getLesson);

router.patch(
  lessonRoute.updateLesson,
  userRoleMiddleware(Role.teacher),
  lessonController.updateLesson,
);

router.delete(
  lessonRoute.deleteLesson,
  userRoleMiddleware(Role.teacher),
  lessonController.deleteLesson,
);

router.use(accessTokenMiddleware);

export const lessonApis = router;
