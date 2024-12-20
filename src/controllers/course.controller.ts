import courseService from "@/services/course.service";
import { CreateCourseProps, UpdateCourseProps } from "@/types/course";
import { CustomRequest, CustomUserRequest } from "@/types/request";
import { UserPayload } from "@/types/user";
import catchAsync from "@/utils/catchAsync";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import imgurService from "@/services/imgur.service";
import { CustomError } from "@/configs";
import reviewService from "@/services/review.service";
import { CreateReviewProps } from "@/types/review";
import { generateCourseIdentifierFilter } from "@/utils/generateCourseFilter";
class CourseController {
  createCourse = catchAsync(
    async (req: CustomRequest<CreateCourseProps>, res: Response) => {
      const course = await courseService.createCourse(req.body);
      res.status(StatusCodes.CREATED).json({
        message: "Course created successfully",
        status: "success",
        course: course,
      });
    },
  );

  getCourseById = catchAsync(async (req: Request, res: Response) => {
    const courseIdentifier = req.params.id;

    const filter = generateCourseIdentifierFilter(courseIdentifier);
    const { course, modules, categories } =
      await courseService.getCourse(filter);
    console.log(modules);
    return res.status(StatusCodes.OK).json({
      message: "Get course successfully",
      status: "success",
      course: course,
      modules: modules,
      categories: categories,
    });
  });

  getCourses = catchAsync(async (req: Request, res: Response) => {
    const courses = await courseService.getCourses(req.query);
    return res.status(StatusCodes.OK).json({
      message: "Get courses successfully",
      status: "success",
      courses: courses,
    });
  });

  updateCourse = catchAsync(
    async (req: CustomRequest<UpdateCourseProps>, res: Response) => {
      const user = req.user as UserPayload;
      const userId = user.id;
      const courseId = req.params.id;
      const course = await courseService.updateCourse(
        { id: courseId },
        userId,
        req.body,
      );
      return res.status(StatusCodes.OK).json({
        message: "Update course successfully",
        status: "success",
        course: course,
      });
    },
  );

  deleteCourse = catchAsync(
    async (req: CustomUserRequest<UserPayload>, res: Response) => {
      const courseId = req.params.id;
      const userId = req.user.id;
      await courseService.deleteCourse({ id: courseId }, userId);
      return res.status(StatusCodes.OK).json({
        message: "Get courses successfully",
        status: "success",
      });
    },
  );

  uploadThumbnail = catchAsync(async (req: Request, res: Response) => {
    const courseId = req.params.id;
    const image = req.file;
    const user = req.user as UserPayload;
    const userId = user.id;
    if (!image) {
      throw new CustomError("Image is required", StatusCodes.BAD_REQUEST);
    }
    const thumbnailUrl = await imgurService.uploadImage(image);
    const updatedCourse = await courseService.updateCourse(
      { id: courseId },
      userId,
      {
        thumbnailUrl,
      },
    );
    return res.status(StatusCodes.OK).json({
      message: "Upload thumbnail successfully",
      status: "success",
      course: updatedCourse,
    });
  });

  addReview = catchAsync(
    async (req: CustomRequest<CreateReviewProps>, res: Response) => {
      const courseId = req.params.id;
      const user = req.user as UserPayload;
      const review = await reviewService.createReview(
        req.body,
        user.id,
        courseId,
      );
      return res.status(StatusCodes.OK).json({
        message: "Add review successfully",
        status: "success",
        review: review,
      });
    },
  );
  getReviews = catchAsync(async (req: Request, res: Response) => {
    const courseId = req.params.id;
    const reviews = await reviewService.getReviews({ courseId });
    return res.status(StatusCodes.OK).json({
      message: "Get reviews successfully",
      status: "success",
      reviews: reviews,
    });
  });
}

export default new CourseController();
