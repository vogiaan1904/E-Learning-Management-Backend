import { CustomError, routesConfig } from "@/configs";
import { accessTokenMiddleware } from "@/middlewares";
import imgurService from "@/services/imgur.service";
import catchAsync from "@/utils/catchAsync";
import upload from "@configs/multer.config";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
const router = Router();
const { uploadImageRoute } = routesConfig;

router.get(uploadImageRoute.status, (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: "Courses APIs",
    status: "success",
  });
});

router.post(
  uploadImageRoute.default,
  accessTokenMiddleware,
  upload.single("image"),
  catchAsync(async (req: Request, res: Response) => {
    const image = req.file;
    if (!image) {
      throw new CustomError("Image is required", StatusCodes.BAD_REQUEST);
    }
    const imageUrl = await imgurService.uploadImage(image);
    if (!imageUrl) {
      throw new CustomError(
        "Upload image failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
    console.log(imageUrl);
    return res.status(StatusCodes.OK).json({
      message: "Upload image successfully",
      status: "success",
      imageUrl: imageUrl,
    });
  }),
);

export const uploadImageApis = router;
