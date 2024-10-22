import { TypographyH1, TypographyMuted } from "@/components/ui/typography";
import { useModalsSelectedAndOpenState } from "@/components/active-numbers/hooks/use-modals-selected-and-open-state";
import { ModalsForSelectedLine } from "@/components/active-numbers/modals-for-selected-line";
import React, { useState } from "react";
import { BadgeCount } from "@/components/ui/badge-count";
import { useLinesInfiniteQuery } from "@/components/usage-history/hooks/use-lines-infinite-query";
import { useReportedLinesInfiniteQuery } from "@/components/usage-history/hooks/use-reported-lines-infinite-query";
import { UsedNumbersTable } from "@/components/usage-history/used-numbers-table";
import { ReportedNumbersTable } from "@/components/usage-history/reported-numbers-table";
import CustomTabs from "@/components/ui/custom-tabs";
import { SkeletonTanstackTable } from "@/components/ui/skeleton-tanstack-table";

export const UsageHistoryPage = () => {
  const {
    data: linesReponse,
    isLoading: isLoadingUsedNumbers,
    fetchNextPage: fetchNextPageUsedNumbers,
  } = useLinesInfiniteQuery();

  const linesData = linesReponse?.pages.flatMap((page) => page.data);
  const usedLinesCount = linesReponse?.pages[0].meta.count;

  const {
    data: reportedLinesResponse,
    isLoading: isLoadingReportedNumbers,
    fetchNextPage: fetchNextPageReportedNumbers,
  } = useReportedLinesInfiniteQuery();

  const reportedLines = reportedLinesResponse?.pages.flatMap((page) => page.data);
  const reportedLinesCount = reportedLinesResponse?.pages[0].meta.count;

  const modalsState = useModalsSelectedAndOpenState();

  const { setIsOpenReportPhoneNumberModal, setSelectedILine } = modalsState;

  const [currentTableName, setCurrentTableName] = useState<string>("used");

  const tableNames = React.useMemo(
    () => [
      {
        name: "used",
        label: "Used Numbers",
        badgeCount: (
          <BadgeCount
            count={usedLinesCount || 0}
            className="bg-container_light w-6 h-6"
            textClassName="text-text_01 text-sm"
          />
        ),
      },
      {
        name: "reported",
        label: "Reported Numbers",
        badgeCount: (
          <BadgeCount
            count={reportedLinesCount || 0}
            className="bg-container_light w-6 h-6"
            textClassName="text-text_01 text-sm"
          />
        ),
      },
    ],
    [usedLinesCount, reportedLinesCount]
  );

  return (
    <div className="flex flex-col space-y-4">
      <div className="px-12 py-8 pb-3">
        <TypographyH1>Manage and Rent Phone Numbers</TypographyH1>
        <TypographyMuted className="text-text_02">
          Easily rent phone numbers and oversee your active rentals in one place
        </TypographyMuted>
      </div>

      <CustomTabs
        currentTableName={currentTableName}
        setCurrentTableName={setCurrentTableName}
        tableNames={tableNames}
      />

      {/* used numbers table */}

      {currentTableName === "used" &&
        (isLoadingUsedNumbers ? (
          <SkeletonTanstackTable cols={5} rows={9} />
        ) : (
          <UsedNumbersTable
            fetchNextPage={fetchNextPageUsedNumbers}
            linesData={linesData}
            setIsOpenReportPhoneNumberModal={setIsOpenReportPhoneNumberModal}
            setSelectedILine={setSelectedILine}
          />
        ))}

      {/* reported numbers table */}
      {currentTableName === "reported" &&
        (isLoadingReportedNumbers ? (
          <>
            <SkeletonTanstackTable cols={5} rows={9} />
          </>
        ) : (
          <ReportedNumbersTable
            linesData={reportedLines}
            fetchNextPage={fetchNextPageReportedNumbers}
          />
        ))}

      <ModalsForSelectedLine {...modalsState} />
    </div>
  );
};
