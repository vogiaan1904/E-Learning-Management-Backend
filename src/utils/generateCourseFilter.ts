import { GetCoursesProps } from "@/types/course";
import { Prisma } from "@prisma/client";

// interface FilterOptions {
//   filter: {
//     teacherId?: string;
//     categories?: {
//       some: {
//         category: {
//           name: string;
//         };
//       };
//     };
//   };
//   options: {
//     skip?: number;
//     take?: number;
//   };
// }

export const generateCourseFilter = (query: GetCoursesProps) => {
  const { skip, limit, teacherId, category } = query;
  const filter: Prisma.CourseWhereInput = {};
  const options: { skip?: number; take?: number } = {};

  if (skip) {
    options.skip = parseInt(skip, 10);
  }
  if (limit) {
    options.take = parseInt(limit, 10);
  }

  if (teacherId) {
    filter.teacherId = teacherId;
  }

  if (category) {
    filter.categories = {
      some: {
        category: {
          name: category,
        },
      },
    };
  }

  return { filter, options };
};
