import clsx from "clsx";
import { forwardRef } from "react";

type ActiveNumbersTableSmsRowWrapperProps = {
  className?: string;
  children: React.ReactNode;
};

export const ActiveNumbersTableSmsRowWrapper = forwardRef<
  HTMLDivElement,
  ActiveNumbersTableSmsRowWrapperProps
>((props: ActiveNumbersTableSmsRowWrapperProps, ref) => {
  const { children, className } = props;
  return (
    <div
      ref={ref}
      className={clsx(
        `
        grid 
        grid-cols-[111px_117px_568px_222px]
        w-full
      `,
        className
      )}
    >
      {children}
    </div>
  );
});
