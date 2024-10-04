import { DefaultRouteProps } from "@/types/routes/default";

interface LessonRouteProps extends DefaultRouteProps {
  getLesson: string;
  getLessons: string;
  createLesson: string;
  updateLesson: string;
  deleteLesson: string;
}

export const lessonRoute: LessonRouteProps = {
  index: "/lessons",
  default: "/",
  status: "/api-status",
  getLesson: "/:id",
  getLessons: "/many",
  createLesson: "/",
  updateLesson: "/:id",
  deleteLesson: "/:id",
};
