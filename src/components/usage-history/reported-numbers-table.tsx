import {
  TypographyMuted,
  TypographyMutedColumnTitle,
  TypographyP,
  TypographySmall,
} from "@/components/ui/typography";
import { ILineUsed } from "@/api/lines/types";
import { useNumberFormatted } from "@/components/active-numbers/hooks/use-number-formatted";
import CopyButton from "@/components/ui/button-copy";
import { ServicesNames } from "@/components/active-numbers/services-names";
import { formatDistanceToNow } from "date-fns";
import CreditsIcon from "@/assets/svg/credits.svg?react";
import { Badge } from "@/components/ui/badge";
import { ManameAndRentPhoneTableRowWrapper } from "./manage-and-rent-phone-table-row-wrapper";
import { TableOverflowWrapper } from "../templates/tables-overflow-wrapper";
import { useEffect, useRef } from "react";
import { useIsVisible } from "@/hooks/use-is-visible";
import { TablesNoDataFallback } from "../templates/tables-no-data-fallback";

type ReportedNumbersTableProps = {
  linesData?: ILineUsed[];
  fetchNextPage: () => void;
};

export const ReportedNumbersTable = (props: ReportedNumbersTableProps) => {
  const { linesData, fetchNextPage } = props;

  const emptyReportedNumbers = !linesData?.length;

  return emptyReportedNumbers ? (
    <TablesNoDataFallback />
  ) : (
    <TableOverflowWrapper scrollAreaClassName="h-[700px]">
      <ManameAndRentPhoneTableRowWrapper className="h-7 pt-3">
        <TypographyMutedColumnTitle className=" pl-8 pr-6">Phone Number</TypographyMutedColumnTitle>
        <TypographyMutedColumnTitle className=" px-6">Service Name</TypographyMutedColumnTitle>
        <TypographyMutedColumnTitle className=" px-6">Purchase time</TypographyMutedColumnTitle>
        <TypographyMutedColumnTitle className=" px-6">Status</TypographyMutedColumnTitle>
        <div className="flex justify-center px-6">
          <TypographyMutedColumnTitle className="">Credits</TypographyMutedColumnTitle>
        </div>
      </ManameAndRentPhoneTableRowWrapper>

      {linesData?.map((item) => (
        <ReportedNumberItem
          nearLastElement={linesData[linesData.length - 1]?.id === item.id}
          key={item.id}
          iLineUsed={item}
          fetchNextPage={fetchNextPage}
        />
      ))}
    </TableOverflowWrapper>
  );
};

type ReportedNumberItemProps = {
  iLineUsed: ILineUsed;
  fetchNextPage: () => void;
  nearLastElement: boolean;
};

const ReportedNumberItem = (props: ReportedNumberItemProps) => {
  const { iLineUsed, fetchNextPage, nearLastElement } = props;
  const numberFormatted = useNumberFormatted(iLineUsed.number);

  const ref = useRef(null);
  const isVisible = useIsVisible(ref);
  useEffect(() => {
    if (isVisible && nearLastElement) {
      fetchNextPage();
    }
  }, [isVisible, nearLastElement, fetchNextPage]);

  return (
    <div ref={ref} className="flex flex-col space-y-2 border-b border-input">
      <ManameAndRentPhoneTableRowWrapper className="h-16">
        {/* number column */}
        <div className="flex items-center pl-8 pr-6 gap-[10px]">
          <TypographyP className="w-[138px]">{numberFormatted}</TypographyP>
          <div className="flex-1 flex justify-center">
            <CopyButton value={numberFormatted} className="dark:text-icond_dark_2" />
          </div>
        </div>
        {/* service names */}
        <div className="flex items-center px-6">
          <TypographyMuted className="text-text_02">
            <ServicesNames iLine={iLineUsed} />
          </TypographyMuted>
        </div>
        {/* Purchase time */}
        <div className="flex space-x-2 items-center px-6">
          <TypographyMuted className="text-nowrap">
            {formatDistanceToNow(new Date(iLineUsed.createdAt), {
              addSuffix: true,
            })}
          </TypographyMuted>
        </div>
        {/* Status */}
        <div className="flex space-x-2 items-center px-6">
          <Badge variant={"outline"} className="bg-text_notice/10 text-text_notice">
            <TypographySmall>Reported</TypographySmall>
          </Badge>
        </div>
        {/* Credits */}
        <div className="flex space-x-2 items-center justify-center px-6">
          <CreditsIcon />
          <TypographyMuted>{iLineUsed.costSum}</TypographyMuted>
        </div>
      </ManameAndRentPhoneTableRowWrapper>
    </div>
  );
};
