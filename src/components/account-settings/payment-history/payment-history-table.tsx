import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import clsx from "clsx";

import CreditsIcon from "@/assets/svg/credits.svg?react";

import { Icons } from "@/components/ui/icons";
import { Transaction } from "@/api/transactions/types";
import { formatDistanceToNow } from "date-fns";
import useUserState from "@/store/slices/userSlice";
import fileDownload from "js-file-download";
import { useCallback, useEffect, useRef } from "react";
import { usePapaParse } from "react-papaparse";
import { useIsVisible } from "@/hooks/use-is-visible";

export default function PaymentHistoryTable({
  data,
  fetchNextPage,
}: {
  data: Transaction[] | undefined;

  fetchNextPage: () => void;
}) {
  const columnNames: string[] = ["Receipt number", "Credits", "Amount"];

  return (
    <Table className="relative">
      <TableHeader className="sticky z-10 top-0 m-0 bg-background">
        <TableRow className="text-xs h-7 font-medium !border-b-0 grid grid-cols-[188.5px_266px_188.5px_188.5px_188.5px]">
          <TableHead className="text-text_03 pl-6 pr-6 pt-3 pb-0">Payment date</TableHead>
          {columnNames.map((columnName) => (
            <TableHead key={columnName} className="text-text_03 pl-4 pr-6 pt-3 pb-0 ">
              {columnName}
            </TableHead>
          ))}
          <TableHead className="text-text_03 px-8 pt-3 pb-0">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((row) => (
          <PaymentHistoryItem
            key={row.id}
            row={row}
            fetchNextPage={fetchNextPage}
            nearLastElement={data.indexOf(row) === data.length - 1}
          />
        ))}
      </TableBody>
    </Table>
  );
}

const PaymentHistoryItem = ({
  row,
  fetchNextPage,
  nearLastElement,
}: {
  row: Transaction;
  fetchNextPage: () => void;
  nearLastElement: boolean;
}) => {
  const { ...user } = useUserState();
  const { jsonToCSV } = usePapaParse();

  const donwloadTransactionToCsv = useCallback(
    (item: Transaction) => {
      const data = jsonToCSV([item]);
      fileDownload(data, "transactions.csv");
    },
    [jsonToCSV]
  );

  const ref = useRef(null);
  const isVisible = useIsVisible(ref);

  useEffect(() => {
    if (isVisible && nearLastElement) {
      fetchNextPage();
    }
  }, [isVisible, nearLastElement, fetchNextPage]);

  return (
    <TableRow
      ref={ref}
      className="h-16 grid grid-cols-[188.5px_266px_188.5px_188.5px_188.5px] pt-6 pb-2"
    >
      <TableCell className=" px-6 text-text_01 text-[0.8125rem] font-medium leading-4 flex">
        {formatDistanceToNow(row.createdAt, { addSuffix: true })}
      </TableCell>
      <TableCell className=" pl-4 pr-6 text-text_02 text-[0.8125rem] font-medium leading-4 flex">
        {user.fullName}
      </TableCell>
      <TableCell className="pl-4 pr-6 text-text_02 text-sm font-medium flex">
        <div className="flex gap-[3px] items-start">
          <CreditsIcon height={16} width={16} />
          <span
            className={clsx(
              "leading-5 text-sm relative top-[-2px]",
              row.transactionFlow == "Deposit" ? "text-text_02" : "text-text_warning"
            )}
          >
            {row.sum}
          </span>
          {row.transactionFlow == "Deposit" && (
            <Icons.ArrowUpGreen
              height={16}
              width={16}
              className="text-icon_success fill-current stroke-current"
            />
          )}
        </div>
      </TableCell>
      <TableCell className=" pl-4 pr-6 text-text_02 text-[0.8125rem] font-medium leading-4 flex">
        $ {row.amountInUSD}
      </TableCell>
      <TableCell className="px-8 flex justify-start items-center">
        <div
          onClick={() => donwloadTransactionToCsv(row)}
          className="flex justify-center items-center p-1.5 rounded-md bg-btn_secondary relative top-[-8px] left-[2px] cursor-pointer"
        >
          <Icons.Download height={20} width={20} className="text-icon_brand fill-current" />
        </div>
      </TableCell>
    </TableRow>
  );
};
