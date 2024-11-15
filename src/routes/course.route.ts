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
import multer from "Multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = Router();
const { courseRoute } = routesConfig;

router.get(courseRoute.status, (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: "Courses APIs",
    status: "success",
  });
});

router.get(
  courseRoute.getCourses,
  // userRoleMiddleware(Role.teacher),
  queryValidation(CourseQuerySchema),
  courseController.getCourses,
);

router.use(accessTokenMiddleware);

router.post(
  courseRoute.createCourse,
  userRoleMiddleware(Role.teacher),
  dataValidation(CreateCourseSchema),
  courseController.createCourse,
);

router.get(courseRoute.getCourse, courseController.getCourseById);

router.patch(
  courseRoute.uploadThumbnail,
  userRoleMiddleware(Role.teacher),
  upload.single("image"),
  courseController.uploadThumbnail,
);
router.patch(
  courseRoute.updateCourse,
  userRoleMiddleware(Role.teacher),
  dataValidation(UpdateCourseSchema),
  courseController.updateCourse,
);

router.delete(
  courseRoute.deleteCourse,
  userRoleMiddleware(Role.teacher),
  courseController.deleteCourse,
);

export const courseApis = router;
