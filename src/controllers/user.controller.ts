import { CustomError, createWinstonLogger } from "@/configs";
import userService from "@/services/user.service";
import { CustomRequest } from "@/types/request";
import { GetUserProps } from "@/types/user";
import catchAsync from "@/utils/catchAsync";
import { removeFieldsFromObject } from "@/utils/object";
import { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
class userController {
  private readonly logger = createWinstonLogger(userController.name);

  constructor() {}

  createAUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.createAUser(req.body);
    console.log(user);
    return res.status(StatusCodes.OK).json({
      message: "Create user successfully",
      status: "success",
      user: {
        ...removeFieldsFromObject(user, ["password"]),
      },
    });
  });

  updateAUserProfile: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
      const userId = req.params.id;

      if (!userId) {
        throw new CustomError("User not found!", StatusCodes.BAD_REQUEST);
      }

      const user = await userService.updateAUserProfile(
        { id: userId },
        req.body,
      );

      res.status(StatusCodes.OK).json({
        message: "User updated successfully",
        user: {
          ...removeFieldsFromObject(user, ["password"]),
        },
      });
    },
  );

  getAUser = catchAsync(
    async (req: CustomRequest<GetUserProps>, res: Response) => {
      const userId = req.params.id;
      const user = await userService.getAUser({ id: userId });
      return res.status(StatusCodes.OK).json({
        message: "Get user successfully",
        user: {
          ...removeFieldsFromObject(user, ["password"]),
        },
      });
    },
  );
}

export default new userController();
