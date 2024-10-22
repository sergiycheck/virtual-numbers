import { cn } from "@/lib/utils";
import { TypographyH4, TypographyMuted } from "../ui/typography";
import { SelectServicesTableSideBar } from "../sidebar-rent-number/select-services-table-sidebar";

type SidebarProps = {
  className?: string;
};

export function Sidebar({ className }: SidebarProps) {
  return (
    <nav
      id="sidebar"
      className={cn(`relative hidden z-10 xl:block dark:bg-sidebar_bg h-full`, className)}
    >
      <div
        className="relative flex flex-col h-full pt-8 gap-y-6
        dark:shadow-[-4px_0px_32px_0px_rgba(22,22,22,1)] border-l border-r dark:border-none"
      >
        <div className="flex flex-col px-7 gap-y-1">
          <TypographyH4 className="text-text_title font-bold">Rent a new number</TypographyH4>
          <TypographyMuted>Select service & zip code to rent a new number</TypographyMuted>
        </div>

        <div className="flex flex-col gap-y-4 flex-1">
          <SelectServicesTableSideBar />
        </div>
      </div>
    </nav>
  );
}
