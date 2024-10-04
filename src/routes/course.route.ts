import { routesConfig } from "@/configs";
import courseController from "@/controllers/course.controller";
import { accessTokenMiddleware, userRoleMiddleware } from "@/middlewares";
import {
  CourseQuerySchema,
  CreateCourseSchema,
  UpdateCourseSchema,
} from "@/schemas/course.schema";
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
  courseController.createACourse,
);

router.get(
  courseRoute.getCourses,
  userRoleMiddleware(Role.teacher),
  queryValidation(CourseQuerySchema),
  courseController.getManyCourses,
);

router.get(
  courseRoute.getCourse,
  userRoleMiddleware(Role.teacher),
  courseController.getACourseById,
);

router.patch(
  courseRoute.updateCourse,
  userRoleMiddleware(Role.teacher),
  dataValidation(UpdateCourseSchema),
  courseController.updateACourse,
);

router.post(
  courseRoute.enroll,
  userRoleMiddleware(Role.user),
  courseController.enrollACourse,
);

export const courseApis = router;
