import {
  TypographyMuted,
  TypographyMutedColumnTitle,
  TypographyP,
} from "@/components/ui/typography";

import { ILine, ILineUsed } from "@/api/lines/types";
import { useNumberFormatted } from "@/components/active-numbers/hooks/use-number-formatted";
import CopyButton from "@/components/ui/button-copy";
import { ServicesNames } from "@/components/active-numbers/services-names";
import { formatDistanceToNow } from "date-fns";
import CreditsIcon from "@/assets/svg/credits.svg?react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ManameAndRentPhoneTableRowWrapper } from "./manage-and-rent-phone-table-row-wrapper";
import { TableOverflowWrapper } from "../templates/tables-overflow-wrapper";
import { Icons } from "../ui/icons";
import { useEffect, useRef } from "react";
import { useIsVisible } from "@/hooks/use-is-visible";
import { TablesNoDataFallback } from "../templates/tables-no-data-fallback";

type UsageHistoryTableProps = {
  linesData?: ILineUsed[];
  setIsOpenReportPhoneNumberModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedILine: React.Dispatch<React.SetStateAction<ILine | undefined>>;
  fetchNextPage: () => void;
};

export const UsedNumbersTable = ({
  linesData,
  setIsOpenReportPhoneNumberModal,
  setSelectedILine,
  fetchNextPage,
}: UsageHistoryTableProps) => {
  const emptyUsedNumbers = !linesData?.length;
  return emptyUsedNumbers ? (
    <TablesNoDataFallback />
  ) : (
    <TableOverflowWrapper scrollAreaClassName="h-[700px]">
      <ManameAndRentPhoneTableRowWrapper className="h-7 pt-3 sticky top-0 z-20 bg-background">
        <TypographyMutedColumnTitle className="pl-8 pr-6">Phone Number</TypographyMutedColumnTitle>
        <TypographyMutedColumnTitle className="px-6">Service Name</TypographyMutedColumnTitle>
        <TypographyMutedColumnTitle className="px-6">Purchase time</TypographyMutedColumnTitle>
        <TypographyMutedColumnTitle className="px-6">Credits</TypographyMutedColumnTitle>
        <div className="flex justify-end px-8">
          <TypographyMutedColumnTitle className="text-text_03">Actions</TypographyMutedColumnTitle>
        </div>
      </ManameAndRentPhoneTableRowWrapper>

      {linesData?.map((item) => (
        <UsageHistoryItem
          fetchNextPage={fetchNextPage}
          nearLastElement={linesData[linesData.length - 1]?.id === item.id}
          key={item.id}
          iLineUsed={item}
          setIsOpenReportPhoneNumberModal={setIsOpenReportPhoneNumberModal}
          setSelectedILine={setSelectedILine}
        />
      ))}
    </TableOverflowWrapper>
  );
};

type UsageHistoryItemProps = {
  nearLastElement: boolean;
  iLineUsed: ILineUsed;
  setIsOpenReportPhoneNumberModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedILine: React.Dispatch<React.SetStateAction<ILine | undefined>>;
  fetchNextPage: () => void;
};

const UsageHistoryItem = ({
  nearLastElement,
  iLineUsed,
  setIsOpenReportPhoneNumberModal,
  setSelectedILine,
  fetchNextPage,
}: UsageHistoryItemProps) => {
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
        {/* Credits */}
        <div className="flex space-x-2 items-center px-6">
          <CreditsIcon />
          <TypographyMuted>{iLineUsed.costSum}</TypographyMuted>
        </div>
        {/* actions */}
        <div className="flex space-x-2 justify-end items-center px-8">
          <DropdownMenuLineItem
            onReportServiceClick={() => {
              setIsOpenReportPhoneNumberModal(true);
              setSelectedILine(iLineUsed);
            }}
          />
        </div>
      </ManameAndRentPhoneTableRowWrapper>
    </div>
  );
};

function DropdownMenuLineItem({ onReportServiceClick }: { onReportServiceClick?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="w-8 h-8 p-2">
          <Icons.EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-container_dark">
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex space-x-2" onClick={onReportServiceClick}>
            <Icons.Warning fill="#B93A3A" className="w-[28px] h-[28px]" />
            <TypographyMuted className="text-text_warning">Report service</TypographyMuted>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
