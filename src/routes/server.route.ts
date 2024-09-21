import { routesConfig } from "@/configs";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router();
const { serverRoutes } = routesConfig;

router.get(
  [serverRoutes.status, serverRoutes.default],
  (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({
      message: "Server APIs",
      status: "success",
      code: StatusCodes.OK,
    });
  },
);

export const serverApis = router;
