import { CustomError } from "@/configs";
import { prisma } from "@/database/connect.db";
import * as userService from "@/services/user.service";
import { CustomRequest } from "@/types/request";
import {
  CreateUserProps,
  CreateUsersProps,
  DeleteUsersProps,
  UpdateUserProps,
  UpdateUsersProps,
} from "@/types/user";
import { pickFieldsFromObject, removeFieldsFromObject } from "@/utils/object";
import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";

export const createUsers = async (
  req: CustomRequest<CreateUsersProps>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { profile } = req.query;
    const oldUsers: CreateUserProps[] = [];
    const newUsers: CreateUserProps[] = [];
    const { data } = req.body;
    const userPromises = data.map(async (user) => {
      const foundUsers =
        await prisma.$queryRaw`SELECT * FROM public."Users" WHERE username = ${user.username} OR email = ${user.email}`;
      if (_.isEmpty(foundUsers)) {
        newUsers.push(user);
      } else {
        oldUsers.push(user);
      }
    });
    await Promise.all(userPromises);
    const userProfiles = await userService.createUserProfiles(
      newUsers.map((user) =>
        pickFieldsFromObject(user, ["lastName", "firstName"]),
      ),
    );
    const users = await userService.createUsers(
      newUsers.map((user, index) => ({
        ...pickFieldsFromObject(user, ["email", "username", "password"]),
        profileId: userProfiles[index].id,
      })),
      {
        include: !!(profile && profile === "true"),
      },
    );
    return res.status(StatusCodes.OK).json({
      message: "Create users successfully",
      status: "success",
      oldData: oldUsers,
      newData: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { profile, isDeleted } = req.query;
    const users = await userService.getUsers(!!(profile && profile === "true"));
    const filteredUsers = users.filter((user) => {
      if (isDeleted === "true") return !!user.deletedAt;
      if (isDeleted === "false") return !user.deletedAt;
      return true;
    });
    const sanitizedUsers = filteredUsers.map((user) =>
      removeFieldsFromObject<User, "password">(user, ["password"]),
    );
    return res.status(StatusCodes.OK).json({
      message: "Get users successfully",
      status: "success",
      data: sanitizedUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUsers = async (
  req: CustomRequest<DeleteUsersProps>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { ids } = req.body;
    const { action } = req.query;
    const users = await userService.deleteUsers(ids, {
      deleteAction:
        (action as userService.UserOptions["deleteAction"]) || "soft",
    });
    if (!users) {
      throw new CustomError("Users not found", StatusCodes.NOT_FOUND);
    }
    return res.status(StatusCodes.OK).json({
      message: "Delete users successfully",
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const upadteUsers = async (
  req: CustomRequest<UpdateUsersProps>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { data } = req.body;
    const promises = data.map((user) => {
      const { id, ...rest } = user;
      return userService.updateUser(id, rest);
    });
    await Promise.all(promises);
    res.status(StatusCodes.OK).json({
      message: "Users updated successfully",
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { profile, isDeleted = "false" } = req.query;
    if (!id) {
      throw new CustomError("Id is required", StatusCodes.BAD_REQUEST);
    }
    const user = await userService.getUser(
      { id: id },
      { type: "id", include: !!(profile && profile === "true") },
    );
    if (!user) {
      throw new CustomError("User not found", StatusCodes.NOT_FOUND);
    }
    if (user.deletedAt && isDeleted === "false") {
      throw new CustomError("User is deleted", StatusCodes.BAD_REQUEST);
    }
    return res.status(StatusCodes.OK).json({
      message: "Get user successfully",
      status: "success",
      data: removeFieldsFromObject<User, "password">(user, ["password"]),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { action } = req.query;
    const user = await userService.deleteUser(id, {
      deleteAction:
        (action as userService.UserOptions["deleteAction"]) || "soft",
    });
    if (!user) {
      throw new CustomError("User not found", StatusCodes.NOT_FOUND);
    }
    return res.status(StatusCodes.OK).json({
      message: "Delete user successfully",
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserById = async (
  req: CustomRequest<UpdateUserProps>,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (Object.keys(req.body).length === 0) {
      throw new CustomError("Empty body", StatusCodes.BAD_REQUEST);
    }
    const { id } = req.params;
    const user = await userService.updateUser(id, req.body);
    if (!user) {
      throw new CustomError("User not found", StatusCodes.NOT_FOUND);
    }
    return res.status(StatusCodes.OK).json({
      message: "Update user successfully",
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};
