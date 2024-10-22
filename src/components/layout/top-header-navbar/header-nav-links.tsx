import HeaderNavLink from "./header-nav-link";
import { useHeaderInfo } from "./hooks/use-header-info";

export function HeaderNavLinks() {
  const { activeLinesCount, totalLinesAndReportedLinesCount, location } = useHeaderInfo();

  return (
    <nav className="h-full relative left-[10px] top-[2px]">
      <div className="h-full flex items-center gap-x-[4px]">
        <HeaderNavLink
          label="Active Numbers"
          featureActive={activeLinesCount > 0}
          featureActiveCount={activeLinesCount}
          linkActive={location.pathname === "/"}
          to="/"
        />

        <HeaderNavLink
          label="Usage History"
          featureActive={totalLinesAndReportedLinesCount > 0}
          featureActiveCount={totalLinesAndReportedLinesCount}
          linkActive={location.pathname === "/sms-call-history"}
          to="/sms-call-history"
        />

        <HeaderNavLink
          label="API Information"
          linkActive={location.pathname === "/api-information"}
          to="/api-information"
        />

        <HeaderNavLink
          label="Help Center"
          linkActive={location.pathname === "/help-center"}
          to="/help-center"
        />
      </div>
    </nav>
  );
}
