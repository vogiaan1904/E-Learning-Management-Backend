import logger from "@/configs/logger.config";
import userRepo from "@/repositories/user.repo";
import { generateCustomAvatarUrl } from "@/utils/avatar";
import { hashData } from "@/utils/bcrypt";
import { Role } from "@prisma/client";
export const executePrescriptDB = async () => {
  try {
    logger.info("Running database prescript");
    await createAdminAccount();
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const executePrescriptRedis = async () => {
  try {
    logger.info("Running redis prescript");
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const createAdminAccount = async () => {
  const existedAdmin = await userRepo.getOne({
    username: "admin",
  });
  if (existedAdmin) {
    logger.info("Admin account is found");
    return;
  }
  logger.error("Admin account is not found. Creating admin account...");
  // const adminProfile = await userService.createAUserProfile({
  //   firstName: "Admin",
  //   lastName: "SE",
  //   avatar: generateCustomAvatarUrl("Admin", "SE"),
  // });
  await userRepo.create({
    email: "admin@mail.com",
    username: "admin",
    password: hashData("admin123"),
    role: Role.admin,
    isVerified: true,
    userProfile: {
      create: {
        firstName: "Admin",
        lastName: "SE",
        avatar: generateCustomAvatarUrl("Admin", "SE"),
      },
    },
  });
  logger.info("Create admin account successfully");
};
