import SMSApi from "@/api/sms";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useSmsByPhoneActiveLinesInfiniteQuery = ({
  initialPageParam,
  enabled,
  phoneId,
}: {
  initialPageParam: number;
  enabled: boolean;
  phoneId: string;
}) => {
  return useInfiniteQuery({
    queryKey: ["sms-active", phoneId],
    queryFn: async ({ pageParam }) => {
      const axiosResponse = await SMSApi.activeLinesSmsByPhoneId({
        page: pageParam,
        take: 10,
        phoneId,
      });
      return axiosResponse.data;
    },
    initialPageParam,
    enabled,
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
