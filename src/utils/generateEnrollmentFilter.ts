import { EnrollmentStatus, Prisma } from "@prisma/client";
import { GetEnrollmentsProps } from "../types/enrollment";

export const generateEnrollmentFilter = (query: GetEnrollmentsProps) => {
  const { skip, limit, studentId, myLearningTab } = query;
  const filter: Prisma.EnrollmentWhereInput = {};
  const options: { skip?: number; take?: number } = {};
  console.log(query);
  filter.studentId = studentId;
  if (skip) {
    options.skip = parseInt(skip, 10);
  }
  if (limit) {
    options.take = parseInt(limit, 10);
  }
  if (myLearningTab) {
    filter.status = myLearningTab;
  } else {
    filter.status = EnrollmentStatus.IN_PROGRESS;
  }

  return { filter, options };
};
