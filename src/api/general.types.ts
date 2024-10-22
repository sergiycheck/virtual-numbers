export type ErrorResponse = {
  message: string | string[];
  error?: string;
  statusCode: number;
};

type Meta = {
  page: number;
  take: number;
  count: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type PaginatedParams = Partial<Pick<Meta, "page" | "take">>;
export type PagenatedParamsWithSearch = PaginatedParams & { search: string };

export type PaginatedResponse<T = object> = {
  data: T[];
  meta: Meta;
};
