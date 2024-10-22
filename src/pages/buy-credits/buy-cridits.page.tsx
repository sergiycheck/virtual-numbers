import BuyCreditsTable from "@/components/buy-credits/buy-credits-table";
import { TypographyH1, TypographyMuted } from "@/components/ui/typography";

function BuyCreditsPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="pl-12 py-8 border-b border-input">
        <TypographyH1>Buy credits</TypographyH1>
        <TypographyMuted className="text-text_02">
          Elementum facilisis nunc in ultricies nibh. Est mattis nisl id in consequat sed.
        </TypographyMuted>
      </div>

      <div className="mt-4 flex-1">
        <BuyCreditsTable />
      </div>
    </div>
  );
}

export default BuyCreditsPage;
