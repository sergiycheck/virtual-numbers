import clsx from "clsx";

export const BuyCreditsTableTBodyRowWrapper = ({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        `
        grid 
        grid-cols-[64px_227px_250px_471px]
        w-full
      `,
        className
      )}
    >
      {children}
    </div>
  );
};

export const BuyCreditsTableTHeadRowWrapper = ({
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
        grid-cols-[283px_250px_471px]
        w-full
      `,
        className
      )}
    >
      {children}
    </div>
  );
};
