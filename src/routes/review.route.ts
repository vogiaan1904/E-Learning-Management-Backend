import { routesConfig } from "@/configs";
import reviewController from "@/controllers/review.controller";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router();

const { reviewRoute } = routesConfig;

router.get(reviewRoute.status, (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: "Reviews APIs",
    status: "success",
  });
});

router.get(reviewRoute.getReview, reviewController.getReview);
router.patch(reviewRoute.updateReview, reviewController.updateReview);
