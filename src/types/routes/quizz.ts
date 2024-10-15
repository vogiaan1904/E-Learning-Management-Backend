import { DefaultRouteProps } from "@/types/routes/default";

interface QuizzRouteProps extends DefaultRouteProps {
  getQuizz: string;
  getQuizzes: string;
  createQuizz: string;
  updateQuizz: string;
  deleteQuizz: string;
}
export const quizzRoute: QuizzRouteProps = {
  index: "/quizzes",
  default: "/",
  status: "/api-status",
  createQuizz: "/",
  getQuizz: "/:id",
  getQuizzes: "/many",
  updateQuizz: "/:id",
  deleteQuizz: "/:id",
};
