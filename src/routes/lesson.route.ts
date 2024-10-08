import { routesConfig } from "@/configs";
import { accessTokenMiddleware } from "@/middlewares";
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

export const lessonApis = router;
