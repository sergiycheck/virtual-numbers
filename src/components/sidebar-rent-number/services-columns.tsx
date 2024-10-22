import { TService } from "@/api/services";
import CreditsIcon from "@/assets/svg/credits.svg?react";
import TanstackTableCheckbox from "@/components/ui/tanstack-table-checkbox";
import { createColumnHelper } from "@tanstack/react-table";
import { TypographyMuted, TypographyMutedColumnTitle } from "../ui/typography";
import clsx from "clsx";

const columnHelper = createColumnHelper<TService>();

export const servicesColumns = [
  columnHelper.accessor("name", {
    id: "selection",
    header: () => (
      <div className="flex">
        <TypographyMutedColumnTitle>Service Name</TypographyMutedColumnTitle>
      </div>
    ),
    cell: ({ getValue, row }) => (
      <div className="flex items-center gap-3">
        <TanstackTableCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
        <TypographyMuted
          className={clsx("capitalize text-text_02", row.getIsSelected() && "text-foreground")}
        >
          {getValue()}
        </TypographyMuted>
      </div>
    ),
  }),
  columnHelper.accessor("price", {
    header: () => (
      <div className="flex justify-end">
        <TypographyMutedColumnTitle>Cost</TypographyMutedColumnTitle>
      </div>
    ),
    cell: (props) => (
      <div className="flex items-center gap-1 justify-end">
        <TypographyMuted
          className={clsx("text-text_02 text-xs", props.row.getIsSelected() && "text-foreground")}
        >
          {props.getValue()}
        </TypographyMuted>
        <CreditsIcon className="w-3 h-3" />
      </div>
    ),
  }),
];
