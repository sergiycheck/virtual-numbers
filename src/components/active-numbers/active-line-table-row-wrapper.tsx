import clsx from "clsx";

export const ActiveNumbersTableRowWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={clsx(
        `
        grid 
        grid-cols-[220px_308px_181px_311px]
        w-full
      `,
        className
      )}
    >
      {children}
    </div>
  );
};
