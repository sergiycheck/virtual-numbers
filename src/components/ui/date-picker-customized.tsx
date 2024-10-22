import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Label } from "./label";
import { Calendar } from "./calendar";
import { format } from "date-fns";
import { Icons } from "./icons";

interface Props {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  label: string;
  placeholder?: string;
  dateFormat?: string;
}

export default function DatePicker(props: Props) {
  const {
    selectedDate,
    onDateChange,
    label,
    placeholder = "Pick a date",
    dateFormat = "dd/MM/yyyy",
  } = props;

  return (
    <div className="flex flex-1 flex-col gap-y-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className="flex-1 font-normal justify-between border-field_
            border py-2.5 pl-3 bg-container_brand_dark"
          >
            {selectedDate ? format(selectedDate, dateFormat) : <span>{placeholder}</span>}

            <Icons.Calendar className="h-4 w-4 text-icon_brand fill-current" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-container_dark rounded-lg">
          <Calendar
            mode="single"
            selected={selectedDate as any}
            onSelect={onDateChange as any}
            formatters={{
              formatWeekdayName: (day) => {
                return day.toLocaleDateString("en-US", {
                  weekday: "narrow",
                });
              },
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
