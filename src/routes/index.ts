import { routesConfig } from "@/configs";
import { authApis } from "@/routes/auth.route";
import { serverApis } from "@/routes/server.route";
import { Router } from "express";
import { userApis } from "./user.route";
import { teacherApis } from "./teacher.route";
import { courseApis } from "./course.route";
import { studentApis } from "./student.route";
import { enrollmentApis } from "./enrollment.route";
import { moduleApis } from "./module.route";
import { lessonApis } from "./lesson.route";
import { quizzApis } from "./quizz.route";
import { questionApis } from "./question.route";
import { searchApis } from "./search.route";
import { uploadImageApis } from "./uploadImage.route";
import { notificationApis } from "./notification.route";

interface ConfigsProps {
  index: string;
  api: Router;
}

const router = Router();

const apiConfigs: ConfigsProps[] = [
  {
    index: routesConfig.serverRoutes.index,
    api: serverApis,
  },
  {
    index: routesConfig.authRoute.index,
    api: authApis,
  },
  {
    index: routesConfig.userRoute.index,
    api: userApis,
  },
  {
    index: routesConfig.teacherRoute.index,
    api: teacherApis,
  },
  {
    index: routesConfig.studentRoute.index,
    api: studentApis,
  },
  {
    index: routesConfig.courseRoute.index,
    api: courseApis,
  },
  {
    index: routesConfig.enrollmentRoute.index,
    api: enrollmentApis,
  },
  {
    index: routesConfig.moduleRoute.index,
    api: moduleApis,
  },
  {
    index: routesConfig.lessonRoute.index,
    api: lessonApis,
  },
  {
    index: routesConfig.quizzRoute.index,
    api: quizzApis,
  },
  {
    index: routesConfig.questionRoute.index,
    api: questionApis,
  },

  {
    index: routesConfig.searchRoute.index,
    api: searchApis,
  },

  {
    index: routesConfig.uploadImageRoute.index,
    api: uploadImageApis,
  },

  {
    index: routesConfig.notificationRoute.index,
    api: notificationApis,
  },
];

apiConfigs.forEach((c) => router.use(c.index, c.api));

export const apis = router;
