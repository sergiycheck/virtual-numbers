import React, { useEffect, useMemo, useRef, useState } from "react";

import { Message } from "@/api/sms/types";
import { formatDistance } from "date-fns";
import { TypographyMuted, TypographyP, TypographySmall } from "../ui/typography";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import CopyButton from "../ui/button-copy";
import { Icons } from "../ui/icons";
import { ActiveNumbersTableSmsRowWrapper } from "./active-line-table-row-sms-wrapper";
import { useIsVisible } from "@/hooks/use-is-visible";
import { cn } from "@/lib/utils";
import CreditsIcon from "@/assets/svg/credits.svg?react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import LinesAPI from "@/api/lines";
import ConfirmActionModal from "../ui/modal-confirm-action";
import { TService } from "@/api/services";

type MessageItemProps = {
  phoneId: string;
  sms: Message;
  nearLastElementSmses: boolean;
  fetchNextPageSmses: () => void;
  setEnabledFetchNextPageSmses: React.Dispatch<React.SetStateAction<boolean>>;
};

export function SMSItem(props: MessageItemProps) {
  const { sms, nearLastElementSmses, fetchNextPageSmses, setEnabledFetchNextPageSmses, phoneId } =
    props;

  const codeFromContent = sms.content.match(/\d+/)?.[0];

  const ref = useRef(null);
  const isVisible = useIsVisible(ref);

  useEffect(() => {
    if (isVisible && nearLastElementSmses) {
      fetchNextPageSmses();
      setEnabledFetchNextPageSmses(true);
    }
  }, [isVisible, nearLastElementSmses, fetchNextPageSmses, setEnabledFetchNextPageSmses]);

  const { isWrongService } = sms;
  const price = 0;
  const totalCost = 0;

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [requestConfirmationDialog, setRequestConfirmationDialog] = useState(false);

  const addServicesMutation = useMutation({
    mutationFn: LinesAPI.addServices,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lines-active"] });
      queryClient.invalidateQueries({ queryKey: ["get-me"] });
      queryClient.invalidateQueries({ queryKey: ["sms-active"] });

      toast({
        title: "Service added",
        description: "Service has been added successfully",
      });
    },
    onError: (error: string) => {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    },
  });

  const handleRequestLines = async () => {
    await addServicesMutation.mutateAsync({
      lineId: phoneId,
      servicesIds: [sms.service],
    });
    setRequestConfirmationDialog(false);
  };

  const services = queryClient.getQueryData(["search-services", "", ""]) as TService[] | undefined;

  const serviceFromSerchServices = useMemo(() => {
    return services?.find((service) => service.id === sms.service);
  }, [services, sms.service]);

  return (
    <ActiveNumbersTableSmsRowWrapper
      ref={ref}
      className={cn("min-h-[72px]", isWrongService && "bg-container_same_bg")}
    >
      <div className="flex items-center px-6 py-7">
        <TypographyMuted className="text-[13px] font-medium">
          {serviceFromSerchServices?.name || "Unknown"}
        </TypographyMuted>
      </div>
      <div className="flex items-center px-6 py-7">
        <TypographyMuted className="text-[13px] font-medium">
          {formatDistance(new Date(sms.receivedAt), new Date(), {
            addSuffix: true,
          })}
        </TypographyMuted>
      </div>

      <div className="text-sm text-text_02 px-6 py-7 flex items-center">
        <TypographyMuted
          className={cn(
            "text-[13px] font-medium",
            isWrongService && "italic font-light leading-4 tracking-wide"
          )}
        >
          {codeFromContent ? parseAndWrapNumber(sms.content) : sms.content}
        </TypographyMuted>
      </div>
      <div className="flex justify-end px-6 py-7">
        {isWrongService ? (
          <>
            <Button
              onClick={() => setRequestConfirmationDialog(true)}
              variant="secondary"
              className="w-[166px] h-7 py-[6px] px-4 flex gap-x-2"
            >
              <div className="flex gap-x-1 items-center">
                <Icons.PlusBrandIcon className="w-4 h-4" />
                <span>Add service</span>
              </div>
              <div className="flex gap-x-1 items-center">
                <CreditsIcon className="h-[12px] w-[12px]" />
                <TypographyP className="text-[12px] leading-4 font-normal text-foreground">
                  {price}
                </TypographyP>
              </div>
            </Button>
          </>
        ) : (
          <>
            {/* TODO: implement on the back end */}
            {/* <Button variant="secondary" className="w-8 h-8 p-2">
              <Icons.EllipsisVertical />
            </Button> */}
          </>
        )}
      </div>

      <ConfirmActionModal
        isPending={addServicesMutation.isPending}
        open={requestConfirmationDialog}
        onOpenChange={setRequestConfirmationDialog}
        actionCallback={handleRequestLines}
        title="Add service?"
        titleDescription="Are you sure you want to add service:"
        description={
          <>
            <ul className="ml-5 py-2 list-disc">
              <li key={serviceFromSerchServices?.id}>{serviceFromSerchServices?.name}</li>
            </ul>
            <div className="flex items-center space-x-2">
              <TypographySmall>That will cost</TypographySmall>
              <div className="flex items-center gap-1">
                <CreditsIcon width={15} height={15} />
                <TypographyMuted>{totalCost}</TypographyMuted>
              </div>
              <TypographySmall>credits</TypographySmall>
            </div>
          </>
        }
      />
    </ActiveNumbersTableSmsRowWrapper>
  );
}

const NumberWrapper = ({ number }: { number: string }) => {
  const copyBuffunRef = React.useRef<HTMLButtonElement>(null);

  const handleBadgeClick = () => {
    copyBuffunRef.current?.click();
  };

  return (
    <Badge
      onClick={handleBadgeClick}
      variant={"secondary"}
      className="inline-flex space-x-1 hover:cursor-pointer"
    >
      <span>{number}</span>
      <CopyButton ref={copyBuffunRef} value={number} className="text-icon_brand" />
    </Badge>
  );
};

const parseAndWrapNumber = (text: string) => {
  const parts = text.split(/([0-9_-]+)/);
  return parts.map((part, index) => {
    if (/\d+/.test(part)) {
      return <NumberWrapper key={index} number={part} />;
    }
    return part;
  });
};
