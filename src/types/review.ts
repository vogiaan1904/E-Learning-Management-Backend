/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Review } from "@prisma/client";

export interface CreateReviewProps extends Pick<Review, "rating" | "comment"> {}

export interface UpdateReviewProps extends Pick<Review, "rating" | "comment"> {}

export interface GetReviewsProps {
  courseId: string;
}
