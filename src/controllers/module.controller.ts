import moduleService from "@/services/module.service";
import { CreateModuleProps, UpadteModuleProps } from "@/types/module";
import { CustomRequest } from "@/types/request";
import { UserPayload } from "@/types/user";
import catchAsync from "@/utils/catchAsync";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class ModuleController {
  createModule = catchAsync(
    async (req: CustomRequest<CreateModuleProps>, res: Response) => {
      const user = req.user as UserPayload;
      const teacherId = user.id;
      const module = await moduleService.createModule(req.body, teacherId);
      res.status(StatusCodes.CREATED).json({
        message: "Module created successfully",
        status: "success",
        module: module,
      });
    },
  );

  getModuleById = catchAsync(async (req: Request, res: Response) => {
    const moduleId = req.params.id;
    const { module, lessonIds, quizzIds } = await moduleService.getModule({
      id: moduleId,
    });
    return res.status(StatusCodes.OK).json({
      message: "Get module successfully",
      status: "success",
      module: module,
      lessonIds: lessonIds,
      quizzIds: quizzIds,
    });
  });

  getModules = catchAsync(async (req: Request, res: Response) => {
    const modules = await moduleService.getModules(req.query);
    return res.status(StatusCodes.OK).json({
      message: "Get courses successfully",
      status: "success",
      modules: modules,
    });
  });

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
