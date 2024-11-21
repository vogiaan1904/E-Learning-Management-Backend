import { routesConfig } from "@/configs";
import courseController from "@/controllers/course.controller";
import { accessTokenMiddleware, userRoleMiddleware } from "@/middlewares";
import {
  AddReviewSchema,
  CourseQuerySchema,
  CreateCourseSchema,
  UpdateCourseSchema,
} from "@/schemas/course.schema";
import { dataValidation } from "@/validations/data.validation";
import { queryValidation } from "@/validations/query.validation";
import { Role } from "@prisma/client";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import multer from "multer";
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

router.post(
  courseRoute.createCourse,
  accessTokenMiddleware,
  userRoleMiddleware(Role.teacher, Role.admin),
  dataValidation(CreateCourseSchema),
  courseController.createCourse,
);

router.post(
  courseRoute.addReview,
  accessTokenMiddleware,
  userRoleMiddleware(Role.user, Role.admin),
  dataValidation(AddReviewSchema),
  courseController.addReview,
);

router.get(
  courseRoute.getCourses,
  queryValidation(CourseQuerySchema),
  courseController.getCourses,
);

router.get(courseRoute.getCourse, courseController.getCourseById);

router.get(courseRoute.getReviews, courseController.getReviews);

router.patch(
  courseRoute.uploadThumbnail,
  accessTokenMiddleware,
  userRoleMiddleware(Role.teacher, Role.admin),
  upload.single("image"),
  courseController.uploadThumbnail,
);
router.patch(
  courseRoute.updateCourse,
  accessTokenMiddleware,
  userRoleMiddleware(Role.teacher, Role.admin),
  dataValidation(UpdateCourseSchema),
  courseController.updateCourse,
);

router.delete(
  courseRoute.deleteCourse,
  accessTokenMiddleware,
  userRoleMiddleware(Role.teacher, Role.admin),
  courseController.deleteCourse,
);

export const courseApis = router;
