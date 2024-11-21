import { prisma } from "@/database/connect.db";
import { CreateReviewProps } from "@/types/review";
import { Prisma, Review } from "@prisma/client";

class ReviewRepository {
  async create(
    data: CreateReviewProps,
    courseId: string,
    enrollmentId: string,
  ): Promise<Review> {
    const { rating } = data;
    const comment = data.comment || "";
    return await prisma.review.create({
      data: {
        comment,
        rating,
        course: {
          connect: { id: courseId },
        },
        enrollment: {
          connect: { id: enrollmentId },
        },
      },
    });
  }

  async getOne(
    filter: Prisma.ReviewWhereInput,
    options?: object,
  ): Promise<Review | null> {
    return await prisma.review.findFirst({ where: filter, ...options });
  }

  async getMany(
    filter: Prisma.ReviewWhereInput,
    options?: object,
  ): Promise<Review[]> {
    return await prisma.review.findMany({ where: filter, ...options });
  }

  async update(
    filter: Prisma.ReviewWhereUniqueInput,
    data: Prisma.ReviewUpdateInput,
  ): Promise<Review> {
    return await prisma.review.update({ where: filter, data });
  }

  async delete(filter: Prisma.ReviewWhereUniqueInput): Promise<Review> {
    return await prisma.review.delete({ where: filter });
  }
}
export default new ReviewRepository();
