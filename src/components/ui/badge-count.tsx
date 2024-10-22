import clsx from "clsx";
import { Badge } from "./badge";
import { TypographySmall } from "./typography";
import millify from "millify";

export const BadgeCount = ({
  count,
  className,
  textClassName,
}: {
  count?: number;
  className?: string;
  textClassName?: string;
}) => {
  const countFormatted = millify(count || 0);

  return (
    <Badge variant={"rounded"} className={clsx("grid place-content-center", className)}>
      <TypographySmall className={clsx("text-[12px] font-semibold leading-4", textClassName)}>
        {countFormatted}
      </TypographySmall>
    </Badge>
  );
};
