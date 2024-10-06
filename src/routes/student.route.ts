import { routesConfig } from "@/configs";
import studentController from "@/controllers/student.controller";
import { accessTokenMiddleware, userRoleMiddleware } from "@/middlewares";
import { Role } from "@prisma/client";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
const router = Router();
const { studentRoute } = routesConfig;

router.get(studentRoute.status, (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: "Student APIs",
    status: "success",
  });
});

router.use(accessTokenMiddleware);

router.get(
  studentRoute.getEnrollments,
  userRoleMiddleware(Role.user),
  studentController.getEnrollments,
);

router.get(
  studentRoute.getStudents,
  userRoleMiddleware(Role.teacher),
  studentController.getManyStudents,
);

export const studentApis = router;
