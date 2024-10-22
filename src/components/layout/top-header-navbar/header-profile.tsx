import { useNavigate } from "react-router-dom";

import ProfileSettingsIcon from "@/assets/svg/profile-settings.svg?react";
import LogoutIcon from "@/assets/svg/logout.svg?react";
import UserIcon from "@/assets/svg/user-circle.svg?react";
import CreditsIcon from "@/assets/svg/credits.svg?react";
import DropdownArrow from "@/assets/svg/dropdown-arrow.svg?react";

import { useAuthState } from "@/store/slices/authSlice";
import { RiGroupLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { TypographyMuted, TypographySmall } from "@/components/ui/typography";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

interface Props {
  userName?: string;
}

function HeaderProfile({ userName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="flex items-center group" asChild>
        <Button
          variant={"secondary"}
          className="flex gap-[6px] h-[28px] w-[127px] 
            rounded-tr-none rounded-br-none pl-[10px] pr-[6px] py-1 bg-container_dark text-foreground dark:bg-btn_secondary dark:text-btn_secondary-foreground"
        >
          <UserIcon />

          <TypographySmall className="overflow-hidden">{userName}</TypographySmall>

          <DropdownArrow
            className="group-hover:brightness-150 
            group-radix-state-open:rotate-180 "
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="rounded-lg bg-background border border-gray-500/10 dark:bg-dark-400 text-dark 
          dark:text-light shadow-md will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade 
          data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade 
          data-[state=open]:data-[side=left]:animate-slideRightAndFade"
        sideOffset={15}
        alignOffset={0}
        align="end"
      >
        <HeaderProfilePopoverContent setIsOpen={setIsOpen} />
      </PopoverContent>
    </Popover>
  );
}

type HeaderProfilePopoverContentProps = {
  setIsOpen: (value: boolean) => void;
};

export function HeaderProfilePopoverContent(props: HeaderProfilePopoverContentProps) {
  const { setIsOpen } = props;
  const { logout } = useAuthState();
  const navigate = useNavigate();

  return (
    <div className="flex items-center md:items-start flex-col">
      <Button
        variant={"ghost"}
        onClick={() => {
          navigate("/account-settings/profile-details");
          setIsOpen(false);
        }}
        className="py-2 px-3 flex items-center gap-2 w-full md:justify-start"
      >
        <ProfileSettingsIcon />
        <TypographyMuted>Account settings</TypographyMuted>
      </Button>

      <Button
        variant={"ghost"}
        onClick={() => {
          navigate("/team-management");
          setIsOpen(false);
        }}
        className="py-2 px-3 flex items-center gap-2 w-full md:justify-start"
      >
        <RiGroupLine />
        <TypographyMuted>Team management</TypographyMuted>
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => {
          navigate("/account-settings/payment-history");
          setIsOpen(false);
        }}
        className="py-2 px-3 flex items-center gap-2 w-full md:justify-start"
      >
        <CreditsIcon />
        <TypographyMuted>Transaction history</TypographyMuted>
      </Button>
      <Button
        variant={"ghost"}
        onClick={logout}
        className="py-2 px-3 flex items-center gap-2 w-full md:justify-start"
      >
        <LogoutIcon />
        <TypographyMuted>Logout</TypographyMuted>
      </Button>
    </div>
  );
}

export default HeaderProfile;
