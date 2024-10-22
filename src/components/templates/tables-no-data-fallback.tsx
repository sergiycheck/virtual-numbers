import { Info } from "lucide-react";
import { TypographyMuted } from "../ui/typography";

export const TablesNoDataFallback = () => {
  return (
    <div className="flex justify-center p-6">
      <div className="w-fit flex gap-x-2">
        <Info className="w-4 h-4" />
        <TypographyMuted className="text-[13px] font-medium">No data.</TypographyMuted>
      </div>
    </div>
  );
};
