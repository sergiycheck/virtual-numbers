import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "../ui/skeleton";
import { columnNames } from "./team-management.data";

export function SkeletonTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow className="text-xs font-medium !border-b-0 grid grid-cols-[163.8px_201px_163.8px_163.8px_163.8px_163.8px]">
          <TableHead className="text-text_03 pl-8 pr-6 pt-3 pb-0 h-auto">Account Name</TableHead>
          {columnNames.map((columnName, index) => (
            <TableHead key={index} className="text-text_03 px-6 pt-3 pb-0 h-auto">
              {columnName}
            </TableHead>
          ))}
          <TableHead className="text-text_03 text-right px-8 pt-3 pb-0 h-auto">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow
            key={index}
            className="h-16 grid grid-cols-[163.8px_201px_163.8px_163.8px_163.8px_163.8px]"
          >
            <TableCell className="py-6 pl-8 pr-6">
              <Skeleton className="h-4 w-[150px]" />
            </TableCell>
            <TableCell className="p-6">
              <Skeleton className="h-4 w-[180px]" />
            </TableCell>
            <TableCell className="p-6">
              <Skeleton className="h-4 w-[100px]" />
            </TableCell>
            <TableCell className="p-6">
              <Skeleton className="h-4 w-[120px]" />
            </TableCell>
            <TableCell className="px-6 py-[22px]">
              <Skeleton className="h-4 w-[80px]" />
            </TableCell>
            <TableCell className="pl-6 py-[14px] pr-8 flex justify-end">
              <Skeleton className="h-9 w-8" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
