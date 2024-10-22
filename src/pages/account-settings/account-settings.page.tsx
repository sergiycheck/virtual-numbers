import { TypographyH1, TypographyMuted } from "@/components/ui/typography";
import { useState, useEffect } from "react";

import CustomTabs from "@/components/ui/custom-tabs";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const tableNames = [
  { name: "profile-details", label: "Profile Details" },
  { name: "saved-payment-methods", label: "Saved Payment Methods" },
  { name: "payment-history", label: "Payment History" },
  { name: "api-key", label: "API Key" },
];

const usePathname = () => {
  const location = useLocation();
  return location.pathname;
};

export const AccountSettings = () => {
  const [currentTableName, setCurrentTableName] = useState<string>("profile-details");
  const pathname = usePathname();
  const navigate = useNavigate();

  useEffect(() => {
    const pathToTableName = {
      "/profile-details": "profile-details",
      "/saved-payment-methods": "saved-payment-methods",
      "/payment-history": "payment-history",
      "/api-key": "api-key",
    };

    Object.keys(pathToTableName).forEach((path) => {
      if (pathname.includes(path)) {
        setCurrentTableName((pathToTableName as any)[path]);
      }
    });
  }, [pathname]);

  return (
    <div className="flex flex-col">
      <div className="pl-12 py-8 pb-3">
        <TypographyH1>Account settings</TypographyH1>
        <TypographyMuted className="text-text_02">
          Elementum facilisis nunc in ultricies nibh. Est mattis nisl id in consequat sed.
        </TypographyMuted>
      </div>

      <div className="mt-5">
        <CustomTabs
          currentTableName={currentTableName}
          setCurrentTableName={(name) => {
            navigate(`/account-settings/${name}`);
          }}
          tableNames={tableNames}
        />
      </div>

      <Outlet />
    </div>
  );
};
