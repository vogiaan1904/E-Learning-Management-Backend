import { CustomError } from "@/configs";
import courseRepo from "@/repositories/course.repo";
import moduleRepo from "@/repositories/module.repo";
import { CreateModuleProps } from "@/types/module";
import { StatusCodes } from "http-status-codes";

class ModuleService {
  private section = ModuleService.name;
  createModule = async (
    data: CreateModuleProps,
    courseId: string,
    teacherId: string,
  ) => {
    const course = await courseRepo.getOne({ id: courseId });
    if (!course) {
      throw new CustomError(
        "Course not found.",
        StatusCodes.NOT_FOUND,
        this.section,
      );
    }
    if (course.teacherId !== teacherId) {
      throw new CustomError(
        "Course not belong to teacher.",
        StatusCodes.CONFLICT,
        this.section,
      );
    }
    return await moduleRepo.create(data, courseId);
  };
}
export default new ModuleService();
