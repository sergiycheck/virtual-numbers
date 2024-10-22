import LinesAPI from "@/api/lines";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useLinesInfiniteQuery = () => {
  return useInfiniteQuery({
    queryKey: ["lines"],
    queryFn: async ({ pageParam }) => {
      const axiosResponse = await LinesAPI.get({ page: pageParam, take: 100 });
      return axiosResponse.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.data.length === 0) return undefined;
      return lastPageParam + 1;
    },
    getPreviousPageParam: (_, __, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    },
  });
};
