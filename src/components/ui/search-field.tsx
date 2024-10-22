import clsx from "clsx";
import MagnifyingGlass from "@/assets/svg/magnifying-glass.svg?react";
import React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface Props extends React.ComponentProps<"input"> {
  wrapperClassName?: string;
  className?: string;
}

const SearchField = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { wrapperClassName, className, ...rest } = props;

  return (
    <div className={clsx("relative w-full", wrapperClassName)}>
      <span className="absolute top-[12px] left-[12px]">
        <MagnifyingGlass className="text-icond_dark_2 w-4 h-4" />
      </span>
      <Input className={cn("pl-8", className)} ref={ref} type="text" {...rest} />
    </div>
  );
});

export default SearchField;
