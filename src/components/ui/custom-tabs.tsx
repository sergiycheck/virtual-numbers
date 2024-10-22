import { forwardRef } from "react";
import clsx from "clsx";
import { TypographyP } from "./typography";

type CustomTabsProps = {
  currentTableName: string;
  setCurrentTableName: (name: string) => void;
  tableNames: { name: string; label: string; badgeCount?: React.ReactNode }[];
};

const CustomTabs = forwardRef<HTMLDivElement, CustomTabsProps>(
  ({ currentTableName, setCurrentTableName, tableNames }, ref) => (
    <div ref={ref} className="flex gap-x-2 sm:gap-x-5 w-full sm:px-12 border-b border-input">
      {tableNames.map((table) => (
        <div key={table.name} className={clsx("flex items-center sm:space-x-2 pb-4 relative")}>
          <TypographyP
            className={clsx(
              "cursor-pointer text-[11px] text-nowrap sm:text-base leading-5 font-semibold text-text_02",
              currentTableName == table.name && "text-foreground"
            )}
            onClick={() => {
              setCurrentTableName(table.name);
            }}
          >
            {table.label}
          </TypographyP>

          {table?.badgeCount}

          {currentTableName == table.name && (
            <div className="w-full absolute bottom-[0px] right-0 left-[-9x] h-[0.1px] bg-btn_primary p-0 m-0"></div>
          )}
        </div>
      ))}
    </div>
  )
);

export default CustomTabs;
