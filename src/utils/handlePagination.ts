export const handlePagination = (
  skip: number,
  limit: number,
  total: number,
) => {
  const totalPages = Math.ceil(total / limit);
  const previous = skip > 0;
  const next = skip + limit < total;
  const page = Math.floor(skip / limit) + 1;

  return {
    skip,
    limit,
    totalPages,
    total,
    previous,
    next,
    page,
  };
};
