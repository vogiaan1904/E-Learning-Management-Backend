import { CustomError } from "@/configs";
import courseRepo from "@/repositories/course.repo";
import enrollmentRepo from "@/repositories/enrollment.repo";
import reviewRepo from "@/repositories/review.repo";
import { CreateReviewProps, UpdateReviewProps } from "@/types/review";
import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

class ReviewService {
  private section = ReviewService.name;

  createReview = async (
    data: CreateReviewProps,
    studentId: string,
    courseId: string,
  ) => {
    const enrollment = await enrollmentRepo.getOne({ courseId, studentId });
    if (!enrollment) {
      throw new CustomError(
        "Enrollment not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    if (enrollment.status !== "COMPLETED") {
      throw new CustomError(
        "You can only review completed courses.",
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
    const course = await courseRepo.getOne({ id: courseId });
    if (!course) {
      throw new CustomError(
        "Course not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    const review = await reviewRepo.create(data, courseId, enrollment.id);

    const updatedRating =
      (course.rating * course.numReviews + data.rating) /
      (course.numReviews + 1);
    await courseRepo.update(
      { id: courseId },
      { rating: updatedRating, numReviews: { increment: 1 } },
    );
    return review;
  };

  getReview = async (filter: Prisma.ReviewWhereInput) => {
    const review = await reviewRepo.getOne(filter);
    if (!review) {
      throw new CustomError(
        "Review not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    return review;
  };

  getReviews = async (filter: Prisma.ReviewWhereInput) => {
    return await reviewRepo.getMany(filter);
  };

  updateReview = async (
    filter: Prisma.ReviewWhereUniqueInput,
    data: UpdateReviewProps,
  ) => {
    const review = await reviewRepo.getOne(filter);
    if (!review) {
      throw new CustomError(
        "Review not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    return await reviewRepo.update(filter, data);
  };

  deleteReview = async (filter: Prisma.ReviewWhereUniqueInput) => {
    const review = await reviewRepo.getOne(filter);
    if (!review) {
      throw new CustomError(
        "Review not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    return await reviewRepo.delete(filter);
  };
}
export default new ReviewService();
