import { createWinstonLogger } from "@/configs";
import userService from "@/services/user.service";
import { CustomRequest } from "@/types/request";
import { UpdateUserProps } from "@/types/user";
import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";

class userController {
  private readonly logger = createWinstonLogger(userController.name);

  constructor() {}

  updateUser = async (
    req: CustomRequest<UpdateUserProps>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.params.id;
      if (!userId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "User ID is required",
        });
      }
      const result = await userService.updateAUser({ id: userId }, req.body);
      //   if (!result) {
      //     return res.status(StatusCodes.NOT_FOUND).json({
      //       message: "User not found",
      //     });
      //   }
      return res.status(StatusCodes.OK).json({
        message: "User updated successfully",
        data: result,
      });
    } catch (error) {
      this.logger.error(error);
      next(error);
    }
  };
}

export default new userController();
