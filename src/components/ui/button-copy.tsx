import React, { useState } from "react";
import CopyIcon from "@/assets/svg/copy.svg?react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import clsx from "clsx";

type CopyButtonProps = {
  value: string;
  className?: string;
};

const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ value, className }, ref) => {
    const [copied, setCopied] = useState(false);

    const handleCopyClick = async () => {
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Error copying to clipboard:", error);
      }
    };

    return (
      <TooltipProvider>
        <Tooltip open={copied}>
          <TooltipTrigger asChild onClick={handleCopyClick} ref={ref}>
            <span className="hover:cursor-pointer">
              <CopyIcon width={16} height={16} className={clsx(className)} />
            </span>
          </TooltipTrigger>
          {copied && <TooltipContent>{copied ? "Copied!" : "Copy to clipboard"}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
    );
  }
);

export default CopyButton;
