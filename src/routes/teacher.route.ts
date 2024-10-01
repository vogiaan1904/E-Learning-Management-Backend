import { routesConfig } from "@/configs";
import { accessTokenMiddleware } from "@/middlewares";
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

export const teacherApis = router;
