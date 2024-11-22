import { CustomError, createWinstonLogger } from "@/configs";
import userService from "@/services/user.service";
import { CustomRequest } from "@/types/request";
import { CreateUserProps, UpdateUserProfileProps } from "@/types/user";
import catchAsync from "@/utils/catchAsync";
import { removeFieldsFromObject } from "@/utils/object";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
class UserController {
  private readonly logger = createWinstonLogger(UserController.name);

  constructor() {}

  createAUser = catchAsync(
    async (req: CustomRequest<CreateUserProps>, res: Response) => {
      const user = await userService.createUser(req.body);
      console.log(user);
      return res.status(StatusCodes.OK).json({
        message: "Create user successfully",
        status: "success",
        user: {
          ...removeFieldsFromObject(user, ["password"]),
        },
      });
    },
  );

  updateAUserProfile = catchAsync(
    async (req: CustomRequest<UpdateUserProfileProps>, res: Response) => {
      const userId = req.params.id;

      if (!userId) {
        throw new CustomError("User not found!", StatusCodes.BAD_REQUEST);
      }

      const user = await userService.updateUserProfile(
        { id: userId },
        req.body,
      );

      res.status(StatusCodes.OK).json({
        message: "User updated successfully",
        status: "success",
        user: {
          ...removeFieldsFromObject(user, ["password"]),
        },
      });
    },
  );

  getAUser = catchAsync(async (req: Request, res: Response) => {
    const identifier = req.params.id;
    console.log(identifier);
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        identifier,
      );

    const filter = isUuid ? { id: identifier } : { username: identifier };
    const user = await userService.getUser(filter, { includeProfile: true });
    return res.status(StatusCodes.OK).json({
      message: "Get user successfully",
      status: "success",
      user: {
        ...removeFieldsFromObject(user, ["password"]),
      },
    });
  });

  getUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await userService.getUsers(undefined, {
      includeProfile: true,
    });
    return res.status(StatusCodes.OK).json({
      message: "Get users successfully",
      status: "success",
      users: users.map((user) => {
        return removeFieldsFromObject(user, ["password"]);
      }),
    });
  });
}

export default new UserController();
