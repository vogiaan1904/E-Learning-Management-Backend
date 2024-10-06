import { Prisma } from "@prisma/client";
import { GetEnrollmentsProps } from "../types/enrollment";

export const generateEnrollmentFilter = (query: GetEnrollmentsProps) => {
  const { skip, limit, studentId, status } = query;
  const filter: Prisma.EnrollmentWhereInput = {};
  const options: { skip?: number; take?: number } = {};
  filter.studentId = studentId;

  if (skip) {
    options.skip = parseInt(skip, 10);
  }
  if (limit) {
    options.take = parseInt(limit, 10);
  }
  if (status) {
    filter.status = status;
  }

  return { filter, options };
};
