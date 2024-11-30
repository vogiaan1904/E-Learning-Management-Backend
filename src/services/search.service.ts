import { prisma } from "@/database/connect.db";
import { SearchQueryProp } from "@/types/course";
import { ListResultsProps } from "@/types/listResults";
import { handlePagination } from "@/utils/handlePagination";
import { Course } from "@prisma/client";

class SearcheService {
  private section = SearcheService.name;
  search = async (
    searchQuery: SearchQueryProp,
  ): Promise<ListResultsProps<Course>> => {
    const limit = (searchQuery.limit || 10) * 1;
    const skip = (searchQuery.skip || 0) * 1;
    const results = await prisma.course.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchQuery.query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchQuery.query,
              mode: "insensitive",
            },
          },
          {
            categories: {
              some: {
                category: {
                  name: {
                    contains: searchQuery.query,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        ],
      },
      orderBy: {
        numEnrollments: "desc",
      },
      take: limit,
      skip: skip,
    });

    const paginationData = handlePagination(skip, limit, results.length);

    return {
      results,
      ...paginationData,
    };
  };
}
export default new SearcheService();
