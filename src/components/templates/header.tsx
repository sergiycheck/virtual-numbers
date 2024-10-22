import { Link } from "react-router-dom";
import useUserState from "@/store/slices/userSlice";
import { useMemo } from "react";
import { TruverifiLogo } from "../ui/svgs";
import HeaderCredits from "@/components/layout/top-header-navbar/header-credits";
import HeaderProfile from "@/components/layout/top-header-navbar/header-profile";
import { TypographyLogo } from "../ui/typography";
import ThemeSwitch from "../theme/theme-switch";
import { HeaderNavLinks } from "../layout/top-header-navbar/header-nav-links";
import { HeaderRightDrawer } from "../layout/top-header-navbar/header-right-drawer";

import { removeAfterAtSymbol } from "@/utils/remove-after-symbol";

export function Header() {
  const { ...user } = useUserState();
  const userName = useMemo(() => {
    return user.fullName || (user.email && removeAfterAtSymbol(user.email));
  }, [user.fullName, user.email]);

  return (
    <header
      id="header"
      className="fixed left-0 right-0 top-0 z-20 border-b  bg-dark  h-14 backdrop-blur"
    >
      <div className="container flex items-center h-full">
        <div className="flex items-center gap-[40px]">
          <Link to="/" className="flex space-x-2 items-center">
            <TruverifiLogo className="h-[2rem] w-[2rem]" />
            <TypographyLogo className="leading-5 text-[1rem] dark:text-[hsla(0,_0%,100%,_0.5)] font-sans cursor-pointer">
              logoipsum
            </TypographyLogo>
          </Link>

          <ThemeSwitch />
        </div>

        <div className="hidden lg:flex flex-1 items-center justify-center">
          <HeaderNavLinks />
        </div>

        <div className="hidden lg:flex justify-center items-center">
          <div
            className="flex-1 flex justify-end items-center 
            gap-[2px] relative "
          >
            <HeaderProfile userName={userName} />
            <HeaderCredits balance={user.balance || 0} />
          </div>
        </div>

        <div className="lg:hidden flex-1 justify-end flex">
          <HeaderRightDrawer />
        </div>
      </div>
    </header>
  );
}
