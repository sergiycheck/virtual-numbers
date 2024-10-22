import { ReactNode } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

function withTooltip(
  component: ReactNode,
  text: ReactNode,
  contentProps?: Tooltip.TooltipContentProps
) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root disableHoverableContent delayDuration={200}>
        <Tooltip.Trigger>{component}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={5}
            align="start"
            {...contentProps}
            className="data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade select-none rounded-[4px] bg-light-50 border border-subtle dark:bg-dark-50 dark:text-light dark:border-subtle-100 px-2 py-2 z-50 text-sm leading-none shadow-sm will-change-[transform,opacity]"
          >
            {text}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

export default withTooltip;
