import reviewService from "@/services/review.service";
import { CustomRequest } from "@/types/request";
import { UpdateReviewProps } from "@/types/review";
import catchAsync from "@/utils/catchAsync";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class ReviewController {
  getReview = catchAsync(async (req: Request, res: Response) => {
    const reviewId = req.params.id;
    const review = await reviewService.getReview({ id: reviewId });
    res.status(StatusCodes.OK).json({
      message: "Get review successfully",
      status: "success",
      review: review,
    });
  });

  updateReview = catchAsync(
    async (req: CustomRequest<UpdateReviewProps>, res: Response) => {
      const reviewId = req.params.id;
      const review = await reviewService.updateReview(
        { id: reviewId },
        req.body,
      );
      res.status(StatusCodes.OK).json({
        message: "Review updated successfully",
        status: "success",
        review: review,
      });
    },
  );
}

export default new ReviewController();
