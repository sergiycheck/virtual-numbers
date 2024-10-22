import { Table as ReactTable, flexRender } from "@tanstack/react-table";
import clsx from "clsx";

interface Props<T = object> {
  table: ReactTable<T>;
  tHeadClassName?: string;
}

function TanstackTable<T = object>(props: Props<T>) {
  const { table, tHeadClassName } = props;

  return (
    <table className="w-full border-separate border-spacing-0 box-border">
      <thead className={clsx("sticky z-10 top-0 m-0", tHeadClassName)}>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr className="h-7" key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <th key={header.id} className="pt-4 px-7">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row, rowIdx) => (
          <tr
            key={row.id}
            onClick={row.getToggleSelectedHandler()}
            className={clsx(
              "h-[3.25rem] cursor-pointer hover:bg-primary-100",
              row.getIsSelected() && "bg-subtle dark:bg-container_light text-subtle",
              table.options.enableRowSelection && !row.getCanSelect() && "opacity-70"
            )}
          >
            {row.getVisibleCells().map((cell) => {
              return (
                <td
                  className={clsx(
                    "border-b border-input px-7",
                    rowIdx == table.getRowModel().rows.length - 1 && "border-none"
                  )}
                  key={cell.id}
                  style={{
                    width:
                      cell.column.getSize() === Number.MAX_SAFE_INTEGER
                        ? "auto"
                        : cell.column.getSize(),
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TanstackTable;
