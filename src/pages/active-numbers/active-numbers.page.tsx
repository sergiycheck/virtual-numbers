import React from "react";
import {
  TypographyH1,
  TypographyMuted,
  TypographyMutedColumnTitle,
} from "@/components/ui/typography";
import { useModalsSelectedAndOpenState } from "@/components/active-numbers/hooks/use-modals-selected-and-open-state";
import { ModalsForSelectedLine } from "@/components/active-numbers/modals-for-selected-line";
import { ActiveNumbersTableRowWrapper } from "@/components/active-numbers/active-line-table-row-wrapper";
import { TableOverflowWrapper } from "@/components/templates/tables-overflow-wrapper";
import { SkeletonTanstackTable } from "@/components/ui/skeleton-tanstack-table";
import { useActiveLinesInfiniteQuery } from "@/components/active-numbers/queries/use-get-active-lines-infinite-query";
import { ActiveLineNumberItem } from "@/components/active-numbers/active-line-number-item";
import { TablesNoDataFallback } from "@/components/templates/tables-no-data-fallback";

export const ActiveNumbersPage = () => {
  const {
    data: linesReponse,
    isLoading: isLoadingActiveNumbes,
    fetchNextPage: fetchNextPageActiveNumbers,
  } = useActiveLinesInfiniteQuery();

  const linesData = React.useMemo(
    () => (linesReponse ? linesReponse.pages.flatMap((d) => d.data) : []),
    [linesReponse]
  );

  const modalsState = useModalsSelectedAndOpenState();

  const isDataLoading = isLoadingActiveNumbes;

  const emptyData = !linesData.length;

  const {
    setIsOpenSelectServicesModal,
    setIsOpenProlongPhoneNumberModal,
    setIsOpenReportPhoneNumberModal,
    setSelectedILine,
  } = modalsState;

  return (
    <div className="flex flex-col space-y-4">
      <div className="px-12 py-8 border-b border-input">
        <TypographyH1>Active Numbers</TypographyH1>
        <TypographyMuted className="text-text_02">
          Easily rent phone numbers and oversee your active rentals in one place
        </TypographyMuted>
      </div>

      {isDataLoading ? (
        <SkeletonTanstackTable cols={4} rows={9} />
      ) : emptyData ? (
        <>
          <TablesNoDataFallback />
        </>
      ) : (
        <TableOverflowWrapper>
          <ActiveNumbersTableRowWrapper className="pt-3">
            <TypographyMutedColumnTitle className=" pl-8 pr-6 ">
              Phone Number
            </TypographyMutedColumnTitle>
            <TypographyMutedColumnTitle className=" pl-6 pr-6 ">
              Service Name
            </TypographyMutedColumnTitle>
            <TypographyMutedColumnTitle className=" pl-6 pr-6 ">
              Time Left
            </TypographyMutedColumnTitle>
            <div className="flex justify-end pl-8 pr-8">
              <TypographyMutedColumnTitle>Actions</TypographyMutedColumnTitle>
            </div>
          </ActiveNumbersTableRowWrapper>

          {linesData?.map((item) => (
            <ActiveLineNumberItem
              key={item.id}
              iLinesWithSms={item}
              // modals
              setIsOpenSelectServicesModal={setIsOpenSelectServicesModal}
              setIsOpenProlongPhoneNumberModal={setIsOpenProlongPhoneNumberModal}
              setIsOpenReportPhoneNumberModal={setIsOpenReportPhoneNumberModal}
              setSelectedILine={setSelectedILine}
              // fetch
              nearLastElementActiveNumbers={linesData[linesData.length - 1]?.id === item.id}
              fetchNextPageActiveNumbers={fetchNextPageActiveNumbers}
            />
          ))}
        </TableOverflowWrapper>
      )}

      <ModalsForSelectedLine {...modalsState} />
    </div>
  );
};
