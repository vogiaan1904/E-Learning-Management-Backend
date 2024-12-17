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
  const options: {
    skip?: number;
    take?: number;
  } = {};

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

export const generateCourseIdentifierFilter = (courseIdentifier: string) => {
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      courseIdentifier,
    );

  const filter = isUuid ? { id: courseIdentifier } : { slug: courseIdentifier };
  return filter;
};
