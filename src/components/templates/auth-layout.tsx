import { Outlet } from "react-router-dom";
import { TruverifiLogo } from "../ui/svgs";
import { TypographyLogo } from "../ui/typography";

function AuthLayout() {
  return (
    <main className="h-full dark:auth-bg-image">
      <div className="flex p-6">
        <div className="flex items-center justify-center gap-x-[0.62rem] mx-auto">
          <TruverifiLogo />
          <TypographyLogo>truverifi</TypographyLogo>
        </div>
      </div>

      <div className="flex flex-col  sm:grid sm:place-content-center h-full justify-center">
        <Outlet />
      </div>
    </main>
  );
}

export default AuthLayout;
