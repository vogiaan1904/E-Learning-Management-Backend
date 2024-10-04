import { DefaultRouteProps } from "@/types/routes/default";

interface LessonRouteProps extends DefaultRouteProps {
  getLesson: string;
  getLessons: string;
  createLesson: string;
  createLessons: string;
  updateLesson: string;
  updateLessons: string;
  deleteLesson: string;
  deleteLessons: string;
}

export const LessonRoute: LessonRouteProps = {
  index: "/lessons",
  default: "/",
  status: "/api-status",
  getLesson: "/:id",
  getLessons: "/many",
  createLesson: "/",
  createLessons: "/many",
  updateLesson: "/:id",
  updateLessons: "/many",
  deleteLesson: "/:id",
  deleteLessons: "/many",
};
