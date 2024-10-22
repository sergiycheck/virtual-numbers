import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "./icons";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("bg-container_dark p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-start text-sm text-primary text-medium pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center justify-end",
        nav_button: cn("bg-transparent p-0 opacity-100 border-none hover:!bg-transparent"),
        nav_button_previous: "absolute right-5 stroke-current text-text_brand",
        nav_button_next: "absolute right-0 stroke-current text-text_brand",
        table: "w-full border-collapse space-y-1",
        head_row: "flex gap-x-2",
        head_cell:
          "flex justify-center text-primary text-sm font-medium px-2.5 py-1.5 w-[30px] h-[32px]",
        row: "flex w-full mt-2 gap-x-2",
        cell: "h-[30px] w-[30px] flex flex-col justify-center text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-transparent [&:has([aria-selected])]:bg-transparent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-[30px] w-[30px] px-2.5 py-[5px] font-normal bg-transparent aria-selected:opacity-100 rounded-full text-text_02 hover:!bg-transparent hover:border-text_brand hover:border  aria-selected:!bg-btn_primary aria-selected:!text-text_primary_inverted"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-transparent text-text_primary_inverted hover:!bg-container_brand hover:!text-text_primary_inverted",
        day_today: "text-text_brand",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-container_brand aria-selected:text-text_primary_inverte aria-selected:opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <Icons.ArrowLeftBrand className="h-5 w-5" />,
        IconRight: () => <Icons.ArrowRightBrand className="h-5 w-5" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
