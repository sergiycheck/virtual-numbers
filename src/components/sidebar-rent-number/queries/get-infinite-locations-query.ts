import LocationsAPI from "@/api/locations";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useInfiniteLocationsQuery = (search?: string) => {
  return useInfiniteQuery({
    queryKey: ["locations", search],
    queryFn: async ({ pageParam }) => {
      const axiosResponse = await LocationsAPI.get({ page: pageParam, take: 300, search });
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
