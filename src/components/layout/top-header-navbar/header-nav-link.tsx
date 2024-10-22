import { BadgeCount } from "@/components/ui/badge-count";
import { TypographySmall } from "@/components/ui/typography";
import { Link, LinkProps } from "react-router-dom";
import clsx from "clsx";
interface Props extends LinkProps {
  label: string;
  linkActive: boolean;

  featureActive?: boolean;
  featureActiveCount?: number;
  onClick?: () => void;
}

function HeaderNavLink(props: Props) {
  const { label, linkActive, featureActive, featureActiveCount, ...rest } = props;

  return (
    <Link
      className="h-full space-x-[6px] relative w-fit px-[10px] py-[6px] flex flex-nowrap"
      {...rest}
    >
      <span
        className={clsx(
          `h-full flex items-center gap-2 border-b-4 
          border-transparent font-semibold opacity-50 text-nowrap`,
          linkActive && "!border-light-50 !opacity-100"
        )}
      >
        <TypographySmall className="text-[13px] leading-4 font-medium">{label}</TypographySmall>
      </span>
      {featureActive && (
        <BadgeCount
          count={featureActiveCount}
          className={clsx(`h-4 min-w-4`)}
          textClassName="p-[1px] text-ellipsis"
        />
      )}
    </Link>
  );
}

export default HeaderNavLink;
