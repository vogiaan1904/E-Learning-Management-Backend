import logger from "@/configs/logger.config";
import userService from "@/services/user.service";
import { generateCustomAvatarUrl } from "@/utils/avatar";
import { hashData } from "@/utils/bcrypt";

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
  const existedAdmin = await userService.getAUser({
    username: "admin",
  });
  if (existedAdmin) {
    logger.info("Admin account is found");
    return;
  }
  logger.error("Admin account is not found. Creating admin account...");
  const adminProfile = await userService.createAUserProfile({
    firstName: "Admin",
    lastName: "SE",
    avatar: generateCustomAvatarUrl("Admin", "SE"),
  });
  await userService.createAUser({
    email: "admin@mail.com",
    username: "admin",
    password: hashData("admin123"),
    role: "admin",
    profileId: adminProfile.id,
    isVerified: true,
  });
  logger.info("Create admin account successfully");
};
