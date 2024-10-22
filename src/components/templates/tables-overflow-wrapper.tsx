import clsx from "clsx";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { forwardRef } from "react";

type TableOverflowWrapperProps = {
  className?: string;
  children: React.ReactNode;
  scrollAreaClassName?: string;
};

export const TableOverflowWrapper = forwardRef<HTMLDivElement, TableOverflowWrapperProps>(
  (props: TableOverflowWrapperProps, ref) => {
    const { className, children, scrollAreaClassName } = props;

    return (
      <ScrollArea ref={ref} className={clsx("h-[740px]", scrollAreaClassName)}>
        <div
          className={clsx(
            `
          sm:pl-4
          xl:w-[1036px] 
          flex flex-col w-full relative overflow-hidden`,
            className
          )}
        >
          {children}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  }
);
