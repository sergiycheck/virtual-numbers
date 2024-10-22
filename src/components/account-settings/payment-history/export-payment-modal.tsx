import { Modal } from "@/components/ui/modal";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { X as CancelIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import DatePicker from "@/components/ui/date-picker-customized";
import fileDownload from "js-file-download";
import { sub } from "date-fns";
import TransactionsAPI from "@/api/transactions";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  trigger: React.ReactNode;
}

const options = [
  {
    label: "Last 7 days",
    value: "7days",
  },
  {
    label: "Last 30 days",
    value: "30days",
  },
  {
    label: "Customize",
    value: "custom",
  },
];

export default function ExportPaymentModal({ trigger }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);

  const [selectedOption, setSelectedOption] = React.useState<string>("7days");
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);

  const [startDateSelected, setStartDateSelected] = React.useState<string>("");
  const [endDateSelected, setEndDateSelected] = React.useState<string>("");

  const showDatePickers = selectedOption === "custom";

  const { toast } = useToast();

  useEffect(() => {
    let startDateSelected = "";
    let endDateSelected = "";
    const now = new Date();
    if (selectedOption === "7days") {
      endDateSelected = now.toISOString();
      startDateSelected = sub(now, { days: 7 }).toISOString();
    } else if (selectedOption === "30days") {
      endDateSelected = now.toISOString();
      startDateSelected = sub(now, { days: 30 }).toISOString();
    } else if (selectedOption === "custom") {
      if (startDate && endDate) {
        startDateSelected = startDate.toISOString();
        endDateSelected = endDate.toISOString();
      }
    }

    setStartDateSelected(startDateSelected);
    setEndDateSelected(endDateSelected);
  }, [endDate, selectedOption, startDate]);

  const [downloadLoading, setDownloadLoading] = React.useState(false);

  const donwloadTransactionToCsv = async () => {
    if (startDateSelected == "" || endDateSelected == "") {
      toast({
        title: "Please select start and end date",
        variant: "destructive",
      });
      return;
    }

    try {
      setDownloadLoading(true);
      const result = await TransactionsAPI.exportPayments({
        start_date: startDateSelected,
        end_date: endDateSelected,
      });
      const data = result.data;

      fileDownload(data, "transactions.csv");

      toast({
        title: "Exported transactions",
        description: "Transactions have been exported successfully",
      });
      setDownloadLoading(false);
    } catch (error) {
      toast({
        title: "Error exporting transactions",
        variant: "destructive",
      });
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={setIsOpen}
      header
      trigger={trigger}
      title="Export payment history"
      titleDescription="Elementum facilisis nunc in ultricies nibh est mattis nisl"
      className="sm:w-[456px]"
    >
      <div className="flex flex-col pt-7 px-7">
        <RadioGroup
          defaultValue={selectedOption}
          className="gap-4"
          onValueChange={setSelectedOption}
        >
          {options.map((option) => {
            const { value, label } = option;

            return (
              <div className="flex items-center space-x-2" key={option.label}>
                <RadioGroupItem value={value} id={value} className="h-5 w-5" />
                <Label htmlFor="r1" className="font-medium">
                  {label}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
        {showDatePickers && (
          <div className="flex flex-row gap-x-4 items-center mt-4">
            <DatePicker label="Start day" selectedDate={startDate} onDateChange={setStartDate} />
            <DatePicker label="End day" selectedDate={endDate} onDateChange={setEndDate} />
          </div>
        )}
      </div>
      <div className="flex flex-1 gap-4 mt-8 px-7 pb-7">
        <DialogClose asChild>
          <Button
            className="gap-x-1 flex-1 items-center font-bold leading-4 pl-4 pr-5 py-2.5"
            variant="secondary"
          >
            <CancelIcon height={20} width={20} />
            <span>Cancel</span>
          </Button>
        </DialogClose>
        <Button
          isPending={downloadLoading}
          onClick={donwloadTransactionToCsv}
          variant={"default"}
          type="submit"
          className="gap-x-1.5 flex-1 py-2.5 px-5"
        >
          <Icons.ExportDark height={20} width={20} />
          <span>Export</span>
        </Button>
      </div>
    </Modal>
  );
}
