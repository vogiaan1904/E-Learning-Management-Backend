import { DefaultRouteProps } from "@/types/routes/default";

interface QuestionRouteProps extends DefaultRouteProps {
  getQuestion: string;
  getQuestions: string;
  createQuestion: string;
  updateQuestion: string;
  deleteQuestion: string;
}
export const questionRoute: QuestionRouteProps = {
  index: "/questions",
  default: "/",
  status: "/api/status",
  createQuestion: "/",
  getQuestion: "/:id",
  getQuestions: "/many",
  updateQuestion: ":id",
  deleteQuestion: ":id",
};
