import React from "react";
import { Button } from "@/components/ui/button";
import { TypographyMuted, TypographySmall } from "@/components/ui/typography";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LinesAPI from "@/api/lines";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ILine } from "@/api/lines/types";
import { Icons } from "../ui/icons";
import { useToast } from "../ui/use-toast";

const mapRadioValueToData = {
  "dont-receive": "I don't receive anything",
  "number-is-invalid": "Number is invalid",
  "use-as-default": "Use as default card",
};

export const ReportNumberModalContent = ({
  line,
  setIsOpenReportPhoneNumberModal,
}: {
  line?: ILine;
  setIsOpenReportPhoneNumberModal: (value: boolean) => void;
}) => {
  const [radioValue, setRadioValue] = React.useState<
    "dont-receive" | "number-is-invalid" | "use-as-default"
  >("dont-receive");
  const [reportReason, setReportReason] = React.useState("");

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const reportNumberMutation = useMutation({
    mutationFn: LinesAPI.report,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lines-active"] });
      queryClient.invalidateQueries({ queryKey: ["lines-reported"] });
      queryClient.invalidateQueries({ queryKey: ["get-me"] });
      toast({
        title: "Success",
        description: "Phone has been reported successfully",
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

  const handleReportNumber = async () => {
    if (!line) return;
    await reportNumberMutation.mutateAsync({
      lineId: line.id,
      text: reportReason,
      option: mapRadioValueToData[radioValue],
    });
    setIsOpenReportPhoneNumberModal(false);
  };

  return (
    <div className="flex flex-col px-6 py-5 gap-y-6">
      <RadioGroup
        defaultValue="dont-receive"
        value={radioValue}
        onValueChange={(value) => {
          setRadioValue(value as any);
        }}
      >
        <div className="flex items-center gap-x-[12px]">
          <RadioGroupItem value="dont-receive" id="r1" />
          <Label htmlFor="r1">
            <TypographyMuted>I don't receive anything</TypographyMuted>
          </Label>
        </div>
        <div className="flex items-center gap-x-[12px]">
          <RadioGroupItem value="number-is-invalid" id="r2" />
          <Label htmlFor="r2">
            <TypographyMuted>Number is invalid</TypographyMuted>
          </Label>
        </div>
        <div className="flex items-center gap-x-[12px]">
          <RadioGroupItem value="use-as-default" id="r3" />
          <Label htmlFor="r3">
            <TypographyMuted>Use as default card</TypographyMuted>
          </Label>
        </div>
      </RadioGroup>

      <Textarea
        className="text-text_02 placeholder:text-text_disabled h-[132px]"
        placeholder="Enter your reason"
        value={reportReason}
        onChange={(e) => setReportReason(e.target.value)}
      />

      <div className="flex space-x-4">
        <Button
          className="w-full"
          variant="secondary"
          onClick={() => setIsOpenReportPhoneNumberModal(false)}
        >
          <div className="flex space-x-1 items-center">
            <Icons.XBrandIcon className="w-5 h-5" />
            <TypographySmall className="font-bold relative top-[1px]">Cancel</TypographySmall>
          </div>
        </Button>

        <Button
          isPending={reportNumberMutation.isPending}
          className="w-full"
          onClick={handleReportNumber}
        >
          <div className="flex gap-x-[6px] items-center">
            <Icons.Send className="w-5 h-5" />
            <TypographySmall className="font-bold relative top-[1px] right-[-1px]">
              Send report
            </TypographySmall>
          </div>
        </Button>
      </div>
    </div>
  );
};
