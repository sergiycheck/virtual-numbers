import { useActiveLinesInfiniteQuery } from "@/components/active-numbers/queries/use-get-active-lines-infinite-query";
import { useLinesInfiniteQuery } from "@/components/usage-history/hooks/use-lines-infinite-query";
import { useReportedLinesInfiniteQuery } from "@/components/usage-history/hooks/use-reported-lines-infinite-query";
import { useLocation } from "react-router-dom";

export const useHeaderInfo = () => {
  const location = useLocation();

  const { data: response } = useActiveLinesInfiniteQuery();

  const activeLinesCount = response?.pages[0].meta.count ?? 0;

  const { data: linesReponse } = useLinesInfiniteQuery();
  const totalLinesHistory =
    (linesReponse?.pages[0].meta.count ?? 0) * (linesReponse?.pages[0]?.meta.pageCount ?? 0);

  const { data: reportedLinesResponse } = useReportedLinesInfiniteQuery();
  const totalReportedLinesHistory =
    (reportedLinesResponse?.pages[0].meta.count ?? 0) *
    (reportedLinesResponse?.pages[0]?.meta.pageCount ?? 0);

  const totalLinesAndReportedLinesCount = totalLinesHistory + totalReportedLinesHistory;

  return {
    activeLinesCount,
    totalLinesAndReportedLinesCount,
    location,
  };
};
