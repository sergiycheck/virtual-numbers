import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  `grid place-content-center rounded-full px-[0.4rem] py-[0.25rem] text-xs
  font-medium leading-4 transition-colors text-nowrap`,
  {
    variants: {
      variant: {
        default:
          " border-transparent bg-btn_primary text-btn_primary-foreground hover:bg-btn_primary/80",
        secondary:
          " border-transparent bg-btn_secondary text-btn_secondary-foreground hover:bg-btn_secondary/80",

        destructive: " bg-container_light_2 text-foreground hover:bg-container_light_2",

        outline: " text-foreground",
        rounded: ` border-transparent bg-btn_primary border
            dark:text-btn_primary-foreground rounded-full font-bold px-0 py-0
            grid place-content-center
            `,

        success: " bg-container_success text-text_success",
        notice: " bg-container_notice_dark text-text_notice",
        warning: " bg-container_warning_dark text-text_warning",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
