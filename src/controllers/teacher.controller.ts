import { createWinstonLogger } from "@/configs";

class TeacherController {
  private readonly logger = createWinstonLogger(TeacherController.name);

  constructor() {}
}

export default new TeacherController();
