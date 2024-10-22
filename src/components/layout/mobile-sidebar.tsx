import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { Drawer, DrawerContentLeft, DrawerTrigger } from "../ui/drawer";
import { TypographyH4, TypographyMuted } from "../ui/typography";
import { Input } from "../ui/input";
import { SelectServicesTableSideBar } from "../sidebar-rent-number/select-services-table-sidebar";

export const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline">
          <ArrowRight />
        </Button>
      </DrawerTrigger>
      <DrawerContentLeft className="dark:bg-sidebar_bg bg-background h-screen">
        <div
          className="relative flex flex-col h-screen pt-8 gap-y-6
        dark:shadow-[-4px_0px_32px_0px_rgba(22,22,22,1)] border-l border-r dark:border-none"
        >
          <div className="flex flex-col px-7 gap-y-1">
            <TypographyH4 className="text-text_title font-bold">Rent a new number</TypographyH4>
            <TypographyMuted>Select service & zip code to rent a new number</TypographyMuted>
          </div>

          <div className="flex flex-col gap-y-4 flex-1">
            <div className="flex flex-col px-7 gap-y-2">
              <TypographyMuted>Select Zip Code</TypographyMuted>
              <Input placeholder="Any"></Input>
            </div>
            <SelectServicesTableSideBar />
          </div>
        </div>
      </DrawerContentLeft>
    </Drawer>
  );
};
