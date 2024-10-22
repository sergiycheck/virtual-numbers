import clsx from "clsx";

export const ManameAndRentPhoneTableRowWrapper = ({
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
        grid-cols-[220px_308px_169px_98px_225px]
      `,
        className
      )}
    >
      {children}
    </div>
  );
};
