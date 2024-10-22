import clsx from "clsx";
import React from "react";
import Checked from "@/assets/svg/checked.svg?react";
import Unchecked from "@/assets/svg/unchecked.svg?react";
import CheckedHeader from "@/assets/svg/checked-header.svg?react";
import { GoDotFill } from "react-icons/go";

type Props = {
  isHeader?: boolean;
  variant?: "circle" | "square";
  indeterminate?: boolean;
} & React.HTMLProps<HTMLInputElement>;

// eslint-disable-next-line react-refresh/only-export-components
const TanstackTableCheckbox: React.ForwardRefRenderFunction<HTMLInputElement, Props> = (
  { indeterminate = false, isHeader, variant = "square", ...rest },
  ref
) => {
  const defaultRef = React.useRef<HTMLInputElement>();
  const resolvedRef = (ref || defaultRef) as React.MutableRefObject<HTMLInputElement>;

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <div className={clsx("group relative cursor-pointer", rest.className)}>
      {variant == "square" && (
        <>
          {rest.checked ? (
            isHeader ? (
              <CheckedHeader className="text-dark-50 dark:text-light" />
            ) : (
              <Checked className="text-dark-50 dark:text-icon_brand bg-background" />
            )
          ) : (
            <Unchecked className="text-dark-50 dark:text-light" />
          )}
        </>
      )}
      {variant == "circle" && (
        <div
          className={clsx(
            "grid place-content-center w-4 h-4 rounded-full  border-2",
            rest.checked && "bg-dark-50 dark:bg-light border-border_brand"
          )}
        >
          {rest.checked && <GoDotFill className="text-btn_primary" />}
        </div>
      )}
      <input
        className={clsx(`absolute cursor-pointer top-0 left-0 w-full h-full opacity-0`)}
        type="checkbox"
        ref={resolvedRef}
        {...rest}
      />
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default React.forwardRef(TanstackTableCheckbox);
