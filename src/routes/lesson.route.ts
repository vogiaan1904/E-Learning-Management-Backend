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

router.get(lessonRoute.getLesson, lessonController.getLesson);

router.get(lessonRoute.getLessons, lessonController.getLessons);

router.patch(
  lessonRoute.updateLessonInfor,
  userRoleMiddleware(Role.teacher),
  lessonController.updateLessonInfor,
);

router.patch(
  lessonRoute.updateLessonContent,
  userRoleMiddleware(Role.teacher),
  lessonController.updateLessonContent,
);

router.delete(
  lessonRoute.deleteLesson,
  userRoleMiddleware(Role.teacher),
  lessonController.deleteLesson,
);

router.use(accessTokenMiddleware);

export const lessonApis = router;
