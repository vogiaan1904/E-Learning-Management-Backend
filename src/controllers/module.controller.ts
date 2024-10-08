import moduleService from "@/services/module.service";
import { CreateModuleProps } from "@/types/module";
import { CustomRequest } from "@/types/request";
import { UserPayload } from "@/types/user";
import catchAsync from "@/utils/catchAsync";
import { Response } from "express";
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
}
export default new ModuleController();
