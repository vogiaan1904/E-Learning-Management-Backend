import { routesConfig } from "@/configs";
import teacherController from "@/controllers/teacher.controller";
import { accessTokenMiddleware, userRoleMiddleware } from "@/middlewares";
import { Role } from "@prisma/client";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
const router = Router();
const { teacherRoute } = routesConfig;

router.get(teacherRoute.status, (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: "Teacher APIs",
    status: "success",
  });
});

router.use(accessTokenMiddleware);

router.get(
  teacherRoute.getCourse,
  userRoleMiddleware(Role.teacher),
  teacherController.getTeacherCourses,
);

export const teacherApis = router;
