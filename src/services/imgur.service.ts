import { CustomError, envConfig } from "@/configs";
import { ImgurClient } from "imgur";
import { StatusCodes } from "http-status-codes";
const imgurClient = new ImgurClient({ clientId: envConfig.IMGUR_CLIENT_ID });

class ImgurService {
  private section = ImgurService.name;
  uploadImage = async (imageFile: Express.Multer.File) => {
    try {
      const res = await imgurClient.upload({
        image: imageFile.buffer.toString("base64"),
      });
      return res.data.link;
    } catch (error) {
      throw new CustomError(
        `Upload image failed with error: ${error}`,
        StatusCodes.BAD_REQUEST,
        this.section,
      );
    }
  };
}

export default new ImgurService();
