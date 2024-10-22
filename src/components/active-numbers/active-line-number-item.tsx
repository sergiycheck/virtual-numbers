import React, { useEffect, useMemo, useRef } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { Badge } from "@/components/ui/badge";
import CopyButton from "@/components/ui/button-copy";
import {
  TypographyMuted,
  TypographyMutedColumnTitle,
  TypographyP,
  TypographySmall,
} from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import clsx from "clsx";
import { ILine } from "@/api/lines/types";
import { useNumberFormatted } from "./hooks/use-number-formatted";
import { SMSItem } from "./sms-item";
import { ServicesNames } from "./services-names";
import { TimerComponent } from "./timer-component";
import { ActiveNumbersTableRowWrapper } from "./active-line-table-row-wrapper";
import { ActiveNumbersTableSmsRowWrapper } from "./active-line-table-row-sms-wrapper";
import { Icons } from "@/components/ui/icons";
import { useIsVisible } from "@/hooks/use-is-visible";
import { ScrollArea } from "../ui/scroll-area";
import { TablesNoDataFallback } from "../templates/tables-no-data-fallback";
import { useSmsByPhoneActiveLinesInfiniteQuery } from "./queries/use-get-sms-by-phone-id-infinite-query";
import { mergeArrs } from "@/utils/merge-arrays";

type ActiveLieNumberItemProps = {
  iLinesWithSms: ILine;
  // modals
  setIsOpenSelectServicesModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenProlongPhoneNumberModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenReportPhoneNumberModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedILine: React.Dispatch<React.SetStateAction<ILine | undefined>>;
  // fetch
  nearLastElementActiveNumbers: boolean;
  fetchNextPageActiveNumbers: () => void;
};

export function ActiveLineNumberItem({
  iLinesWithSms,
  setIsOpenSelectServicesModal,
  setIsOpenProlongPhoneNumberModal,
  setIsOpenReportPhoneNumberModal,
  setSelectedILine,
  // fetch
  nearLastElementActiveNumbers,
  fetchNextPageActiveNumbers,
}: ActiveLieNumberItemProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const numberFormatted = useNumberFormatted(iLinesWithSms.number);

  const ref = useRef(null);
  const isVisible = useIsVisible(ref);

  useEffect(() => {
    if (isVisible && nearLastElementActiveNumbers) {
      fetchNextPageActiveNumbers();
    }
  }, [isVisible, nearLastElementActiveNumbers, fetchNextPageActiveNumbers]);

  const [enabledFetchNextPageSmses, setEnabledFetchNextPageSmses] = React.useState(false);

  const { data: activeSmsResponse, fetchNextPage: fetchNextPageSmses } =
    useSmsByPhoneActiveLinesInfiniteQuery({
      initialPageParam: 2,
      enabled: enabledFetchNextPageSmses,
      phoneId: iLinesWithSms.id,
    });

  const activeSmsData = React.useMemo(
    () => (activeSmsResponse ? activeSmsResponse.pages.flatMap((d) => d.data) : []),
    [activeSmsResponse]
  );

  const smsesFromCurrentLineAndFetchedArr = useMemo(() => {
    return mergeArrs(iLinesWithSms.smsArr, activeSmsData);
  }, [iLinesWithSms.smsArr, activeSmsData]);

  const emptySmsData = !smsesFromCurrentLineAndFetchedArr?.length;

  const smsCount = useMemo(
    () => smsesFromCurrentLineAndFetchedArr.length,
    [smsesFromCurrentLineAndFetchedArr]
  );

  return (
    <Collapsible.Root
      ref={ref}
      open={isOpen}
      onOpenChange={setIsOpen}
      className={clsx(
        "flex flex-col space-y-2 border-b border-input min-w-max",
        isOpen && "dark:bg-container_same_bg"
      )}
    >
      <ActiveNumbersTableRowWrapper className="py-2 h-16">
        <div className="flex items-center pl-8 pr-6 gap-[10px]">
          <TypographyP className="w-[138px]">{numberFormatted}</TypographyP>
          <div className="flex-1 flex justify-center">
            <CopyButton value={numberFormatted} className="dark:text-icond_dark_2" />
          </div>
        </div>

        <div className="flex items-center pl-6 pr-6">
          <TypographyMuted className="text-text_02">
            <ServicesNames iLine={iLinesWithSms} />
          </TypographyMuted>
        </div>

        <div className="flex space-x-2 items-center pl-6 pr-6">
          <TimerComponent endDate={iLinesWithSms.rentEndDate} />
        </div>

        <div className="flex gap-x-[10px] justify-end pl-8 pr-8">
          {!!smsCount && (
            <div className="flex flex-col gap-y-1 items-center">
              <TypographyMuted className="text-[12px] leading-4">
                {smsCount} messages
              </TypographyMuted>
              <div className="flex justify-end w-full">
                <Badge variant={"secondary"} className="w-fit justify-center py-1 px-[6px]">
                  <TypographySmall className="text-text_brand text-[12px] leading-4 font-medium">
                    {smsCount} new
                  </TypographySmall>
                </Badge>
              </div>
            </div>
          )}

          <div className="flex flex-row space-x-2 items-center">
            <Collapsible.Trigger asChild>
              <Button
                data-state={isOpen ? "open" : "closed"}
                className="transition-all [&[data-state=open]>svg]:rotate-180 w-8 h-8 p-2"
                variant="secondary"
                onClick={() => setIsOpen(!isOpen)}
              >
                <Icons.DownArrow className="h-5 w-5 shrink-0 transition-transform duration-200" />
              </Button>
            </Collapsible.Trigger>

            <DropdownMenuLineItem
              onAddServiceClick={() => {
                setIsOpenSelectServicesModal(true);

                setSelectedILine(iLinesWithSms);
              }}
              onAddTimeClick={() => {
                setIsOpenProlongPhoneNumberModal(true);
                setSelectedILine(iLinesWithSms);
              }}
              onReportServiceClick={() => {
                setIsOpenReportPhoneNumberModal(true);
                setSelectedILine(iLinesWithSms);
              }}
            />
          </div>
        </div>
      </ActiveNumbersTableRowWrapper>

      <Collapsible.Content
        className="dark:bg-container_light w-full overflow-hidden transition-all
          data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
      >
        {emptySmsData ? (
          <TablesNoDataFallback />
        ) : (
          <div className="flex flex-col">
            <ActiveNumbersTableSmsRowWrapper className="border-b h-10">
              <TypographyMutedColumnTitle className=" pl-6 pr-6 py-3 ">
                Service
              </TypographyMutedColumnTitle>
              <TypographyMutedColumnTitle className="pl-6 pr-6 py-3 text-[12px] leading-4">
                Received
              </TypographyMutedColumnTitle>
              <TypographyMutedColumnTitle className=" pl-6 pr-6 py-3 text-[12px] leading-4">
                Message
              </TypographyMutedColumnTitle>
              <div className="flex justify-end pl-6 pr-6 py-3 ">
                <TypographyMutedColumnTitle>Actions</TypographyMutedColumnTitle>
              </div>
            </ActiveNumbersTableSmsRowWrapper>

            <ScrollArea className="h-72">
              {smsesFromCurrentLineAndFetchedArr?.map((item, index) => (
                <div
                  className={clsx(
                    index != smsesFromCurrentLineAndFetchedArr.length - 1 && "border-b"
                  )}
                  key={item.id}
                >
                  <SMSItem
                    phoneId={iLinesWithSms.id}
                    sms={item}
                    nearLastElementSmses={
                      smsesFromCurrentLineAndFetchedArr[
                        smsesFromCurrentLineAndFetchedArr.length - 1
                      ]?.id == item.id
                    }
                    fetchNextPageSmses={fetchNextPageSmses}
                    setEnabledFetchNextPageSmses={setEnabledFetchNextPageSmses}
                  />
                </div>
              ))}
            </ScrollArea>
          </div>
        )}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

function DropdownMenuLineItem({
  onAddServiceClick,
  onAddTimeClick,
  onReportServiceClick,
}: {
  onAddServiceClick?: () => void;
  onAddTimeClick?: () => void;
  onReportServiceClick?: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="w-8 h-8 p-2">
          <Icons.EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-container_dark">
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex space-x-2" onClick={onAddServiceClick}>
            <Icons.PlusIcon className="text-icond_dark_2 w-[28px] h-[28px]" />
            <TypographyMuted>Add service</TypographyMuted>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex space-x-2" onClick={onAddTimeClick}>
            <Icons.AddTimeSvg className="text-icond_dark_2 w-[28px] h-[28px]" />
            <TypographyMuted>Add time</TypographyMuted>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex space-x-2" onClick={onReportServiceClick}>
            <Icons.Warning className="w-[28px] h-[28px]" />
            <TypographyMuted className="text-text_warning">Report service</TypographyMuted>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
