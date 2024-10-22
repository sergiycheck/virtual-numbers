import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { LoaderCircle } from "lucide-react";

const buttonVariants = cva(
  `inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm
    font-medium ring-offset-background transition-colors focus-visible:outline-none 
    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
    disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-text_disabled`,
  {
    variants: {
      variant: {
        default: `bg-btn_primary text-btn_primary-foreground font-bold 
          hover:bg-btn_primary_hover active:bg-btn_primary_pressed disabled:bg-btn_primary_disabled`,

        secondary: `bg-btn_secondary text-btn_secondary-foreground hover:bg-btn_secondary_hover 
          active:bg-btn_secondary_pressed disabled:bg-btn_secondary_disabled disabled:text-btn_secondary_disabled-foreground`,

        link: `text-btn_link_foreground underline-offset-4 hover:underline leading-4
        hover:text-btn_link_hover_foreground disabled:text-btn_link_disabled_foreground `,

        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        link: "p-0 m-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isPending?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isPending, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = props.disabled || isPending;
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {!isPending ? (
          children
        ) : (
          <div className="flex gap-x-2 items-center">
            <span className="text-foreground">Loading...</span>
            <LoaderCircle className="text-foreground animate-spin" />
          </div>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
