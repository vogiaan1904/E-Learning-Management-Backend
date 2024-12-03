import { CustomError, envConfig } from "@/configs";
import { ImgurClient } from "imgur";
import { StatusCodes } from "http-status-codes";
const imgurClient = new ImgurClient({ clientId: envConfig.IMGUR_CLIENT_ID });

class ImgurService {
  private section = ImgurService.name;
  uploadImage = async (imageFile: Express.Multer.File) => {
    const res = await imgurClient.upload({
      image: imageFile.buffer.toString("base64"),
    });
    if (!res.success) {
      throw new CustomError(
        `Upload image failed with error: ${res.data}`,
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
    return res.data.link;
  };
}

export default new ImgurService();
