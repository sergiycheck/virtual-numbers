import CreditsIcon from "@/assets/svg/credits.svg?react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TypographySmall } from "@/components/ui/typography";
import { Icons } from "@/components/ui/icons";

interface Props {
  balance: number;
}

function HeaderCredits(props: Props) {
  const { balance } = props;

  return (
    <div className="flex justify-center items-center gap-[2px] h-6">
      <div
        className="bg-container_dark dark:bg-container_light flex space-x-1 px-3 py-[6px]
        text-foreground items-center"
      >
        <CreditsIcon className="relative bottom-[1px]" />
        <TypographySmall>{balance.toFixed(2)}</TypographySmall>
      </div>

      <Link to="/buy-credits" className="relative top-[1px]">
        <Button size="sm" className="h-[28px] rounded-bl-none rounded-tl-none w-[40px]">
          <Icons.PlusDark className="h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
}

export default HeaderCredits;
