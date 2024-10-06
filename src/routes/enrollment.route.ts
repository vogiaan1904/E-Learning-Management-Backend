import { routesConfig } from "@/configs";
import enrollmentController from "@/controllers/enrollment.controller";
import { accessTokenMiddleware, userRoleMiddleware } from "@/middlewares";
import { Role } from "@prisma/client";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router();
const { enrollmentRoute } = routesConfig;

router.get(enrollmentRoute.status, (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: "Enrollment APIs",
    status: "success",
  });
});

router.use(accessTokenMiddleware);

router.post(
  enrollmentRoute.createEnrollment,
  userRoleMiddleware(Role.user),
  enrollmentController.createEnrollment,
);

router.get(
  enrollmentRoute.getEnrollment,
  userRoleMiddleware(Role.user),
  enrollmentController.getEnrollment,
);

router.patch(
  enrollmentRoute.feedBack,
  userRoleMiddleware(Role.user),
  enrollmentController.feedBack,
);

router.patch(
  enrollmentRoute.cancelEnrollment,
  userRoleMiddleware(Role.user),
  enrollmentController.cancelEnrollment,
);

router.delete(
  enrollmentRoute.deleteEnrollment,
  userRoleMiddleware(Role.user),
  enrollmentController.deleteEnrollment,
);

export const enrollmentApis = router;
