export interface ListResultsProps<T> {
  results: T[];
  total: number;
  limit: number;
  skip: number;
  page: number;
  totalPages: number;
  previous: boolean;
  next: boolean;
}
