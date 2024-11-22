import { DefaultRouteProps } from "./default";

interface ReviewRouteProps extends DefaultRouteProps {
  getReview: string;
  getReviews: string;
  updateReview: string;
  deleteReview: string;
}

export const reviewRoute: ReviewRouteProps = {
  index: "/reviews",
  default: "/",
  status: "/api-status",

  getReview: "/:id",
  getReviews: "/many",
  updateReview: "/:id",
  deleteReview: "/:id",
};
