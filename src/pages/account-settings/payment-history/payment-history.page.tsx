import ExportPaymentModal from "@/components/account-settings/payment-history/export-payment-modal";
import PaymentHistoryTable from "@/components/account-settings/payment-history/payment-history-table";
import { useInfitieQueryGetMyTransactions } from "@/components/account-settings/payment-history/queries/get-my-payment-history-infinite-query";
import { TablesNoDataFallback } from "@/components/templates/tables-no-data-fallback";
import { TableOverflowWrapper } from "@/components/templates/tables-overflow-wrapper";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { SkeletonTanstackTable } from "@/components/ui/skeleton-tanstack-table";
import { TypographySmall } from "@/components/ui/typography";
import { useMemo } from "react";

export const PaymentHistoryPage = () => {
  const { data, isLoading, fetchNextPage } = useInfitieQueryGetMyTransactions();

  const paymentsData = useMemo(() => (data ? data.pages.flatMap((d) => d.data) : []), [data]);

  const emptyData = !paymentsData?.length;

  return (
    <div className="flex flex-col w-full mt-4 pl-2  h-full">
      <div className="flex-1">
        {isLoading ? (
          <SkeletonTanstackTable cols={5} rows={9} />
        ) : emptyData ? (
          <TablesNoDataFallback />
        ) : (
          <TableOverflowWrapper scrollAreaClassName="h-[600px]">
            <PaymentHistoryTable data={paymentsData} fetchNextPage={fetchNextPage} />
          </TableOverflowWrapper>
        )}
      </div>

      <div className="px-12 py-6 flex justify-end border-t border-input mt-4">
        <ExportPaymentModal
          trigger={
            <Button className="pl-4 pr-5 py-2.5 gap-x-1.5 ml-auto w-[227px]">
              <Icons.ExportDark height={20} width={20} />
              <TypographySmall className="font-bold ">Export payment history</TypographySmall>
            </Button>
          }
        />
      </div>
    </div>
  );
};
