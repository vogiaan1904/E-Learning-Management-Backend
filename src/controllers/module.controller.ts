import moduleService from "@/services/module.service";
import {
  CreateModuleProps,
  GetModulesProps,
  UpadteModuleProps,
} from "@/types/module";
import { CustomRequest } from "@/types/request";
import { UserPayload } from "@/types/user";
import catchAsync from "@/utils/catchAsync";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class ModuleController {
  createModule = catchAsync(
    async (req: CustomRequest<CreateModuleProps>, res: Response) => {
      const user = req.user as UserPayload;
      const courseId = req.params.courseId;
      const teacherId = user.id;
      const module = await moduleService.createModule(
        req.body,
        courseId,
        teacherId,
      );
      res.status(StatusCodes.CREATED).json({
        message: "Module created successfully",
        status: "success",
        module: module,
      });
    },
  );

  getModuleById = catchAsync(async (req: Request, res: Response) => {
    const moduleId = req.params.id;
    const { module, lessonIds } = await moduleService.getModule({
      id: moduleId,
    });
    return res.status(StatusCodes.OK).json({
      message: "Get module successfully",
      status: "success",
      module: module,
      lessonIds: lessonIds,
    });
  });

  getModules = catchAsync(
    async (req: CustomRequest<GetModulesProps>, res: Response) => {
      const courses = await moduleService.getModules(req.body);
      return res.status(StatusCodes.OK).json({
        message: "Get courses successfully",
        status: "success",
        courses: courses,
      });
    },
  );

  updateModule = catchAsync(
    async (req: CustomRequest<UpadteModuleProps>, res: Response) => {
      const moduleId = req.params.id;
      const teacher = req.user as UserPayload;
      const teacherId = teacher.id;
      const module = await moduleService.updateModule(
        { id: moduleId },
        req.body,
        teacherId,
      );
      return res.status(StatusCodes.OK).json({
        message: "Update module successfully",
        status: "success",
        module: module,
      });
    },
  );
  deleteModule = catchAsync(async (req: Request, res: Response) => {
    const teacher = req.user as UserPayload;
    const teacherId = teacher.id;
    const moduleId = req.params.id;
    await moduleService.deleteModule({ id: moduleId }, teacherId);
    return res.status(StatusCodes.OK).json({
      message: "Delete courses successfully",
      status: "success",
    });
  });
}
export default new ModuleController();
