import { Skeleton } from "@/components/ui/skeleton";
import clsx from "clsx";

type SkeletonTanstackTableProps = {
  cols: number;
  rows: number;
};

export function SkeletonTanstackTable(props: SkeletonTanstackTableProps) {
  const { cols, rows } = props;

  return (
    <table className="w-full border-separate border-spacing-0 box-border">
      <thead className="sticky z-10 top-0 m-0">
        <tr className="h-7">
          {Array.from({ length: cols }).map((_, index) => (
            <th key={index} className="pt-4 px-7">
              <Skeleton className={`h-4 w-full`} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex} className="h-[3.25rem] cursor-pointer hover:bg-primary-100">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <td
                key={colIndex}
                className={clsx(
                  "border-b border-input px-7",
                  rowIndex === rows - 1 && "border-none"
                )}
              >
                <Skeleton className={`h-4 w-full`} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
