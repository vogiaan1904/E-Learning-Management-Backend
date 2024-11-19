import searchService from "@/services/search.service";
import catchAsync from "@/utils/catchAsync";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class SearchController {
  search = catchAsync(async (req: Request, res: Response) => {
    const results = await searchService.search(req.query);
    return res.status(StatusCodes.OK).json({
      message: "Search courses successfully",
      status: "success",
      courses: results,
    });
  });
}

export default new SearchController();
