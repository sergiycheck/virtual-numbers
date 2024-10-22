import { useAuthState } from "@/store/slices/authSlice";
import HeaderNavLink from "./header-nav-link";
import { useHeaderInfo } from "./hooks/use-header-info";
import { TypographySmall } from "@/components/ui/typography";
import clsx from "clsx";
import { Drawer, DrawerContentRight, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const HeaderRightDrawer = () => {
  const { activeLinesCount, totalLinesAndReportedLinesCount, location } = useHeaderInfo();

  const { logout } = useAuthState();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline">Menu</Button>
      </DrawerTrigger>
      <DrawerContentRight>
        <div className="flex flex-col gap-y-2 mt-12">
          <div className="w-[150px] flex flex-col gap-y-2 mx-auto">
            <HeaderNavLink
              onClick={() => setIsOpen(false)}
              label="Active Numbers"
              featureActive={activeLinesCount > 0}
              featureActiveCount={activeLinesCount}
              linkActive={location.pathname === "/"}
              to="/"
            />

            <HeaderNavLink
              onClick={() => setIsOpen(false)}
              label="Usage History"
              featureActive={totalLinesAndReportedLinesCount > 0}
              featureActiveCount={totalLinesAndReportedLinesCount}
              linkActive={location.pathname === "/sms-call-history"}
              to="/sms-call-history"
            />

            <HeaderNavLink
              onClick={() => setIsOpen(false)}
              label="Account settings"
              linkActive={location.pathname === "/account-settings/profile-details"}
              to="/account-settings/profile-details"
            />

            <HeaderNavLink
              onClick={() => setIsOpen(false)}
              label="Team management"
              linkActive={location.pathname === "/team-management"}
              to="/team-management"
            />

            <HeaderNavLink
              onClick={() => setIsOpen(false)}
              label="Transaction history"
              linkActive={location.pathname === "/account-settings/payment-history"}
              to="/account-settings/payment-history"
            />

            <HeaderNavLink
              onClick={() => setIsOpen(false)}
              label="Buy credits"
              linkActive={location.pathname === "/buy-credits"}
              to="/buy-credits"
            />

            <HeaderNavLink
              onClick={() => setIsOpen(false)}
              label="API Information"
              linkActive={location.pathname === "/api-information"}
              to="/api-information"
            />

            <HeaderNavLink
              onClick={() => setIsOpen(false)}
              label="Help Center"
              linkActive={location.pathname === "/help-center"}
              to="/help-center"
            />

            <TypographySmall
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className={clsx(
                `text-[13px] leading-4 font-medium opacity-50 cursor-pointer px-[10px] py-[6px]`
              )}
            >
              Logout
            </TypographySmall>
          </div>
        </div>
      </DrawerContentRight>
    </Drawer>
  );
};
