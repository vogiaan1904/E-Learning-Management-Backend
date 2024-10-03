import { routesConfig } from "@/configs";
import courseController from "@/controllers/course.controller";
import { accessTokenMiddleware, userRoleMiddleware } from "@/middlewares";
import { courseQuerySchema } from "@/schemas/course.schema";
import { CreateCourseSchema } from "@/schemas/teacher.schema";
import { dataValidation } from "@/validations/data.validation";
import { queryValidation } from "@/validations/query.validation";
import { Role } from "@prisma/client";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
const router = Router();
const { courseRoute } = routesConfig;

router.get(courseRoute.status, (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: "Courses APIs",
    status: "success",
  });
});

router.use(accessTokenMiddleware);

router.post(
  courseRoute.createCourse,
  userRoleMiddleware(Role.teacher),
  dataValidation(CreateCourseSchema),
  courseController.createCourse,
);

router.get(
  courseRoute.getCourse,
  userRoleMiddleware(Role.teacher),
  courseController.getCourseById,
);

router.get(
  courseRoute.getCourses,
  userRoleMiddleware(Role.teacher),
  queryValidation(courseQuerySchema),
  courseController.getManyCourses,
);

export const courseApis = router;
