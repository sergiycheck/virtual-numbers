import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import clsx from "clsx";

export type ModalBaseProps = {
  trigger?: ReactNode;

  header: boolean;

  title?: ReactNode;
  titleDescription?: ReactNode;
  titleSytles?: string;
  titleDescriptionStyles?: string;

  children: ReactNode;
  childrenFooter?: ReactNode;
  className?: string;
} & DialogPrimitive.DialogProps;

export function Modal({
  trigger,

  header,
  title,
  titleDescription,
  titleSytles,
  titleDescriptionStyles,

  children,

  childrenFooter,
  className,
  ...rest
}: ModalBaseProps) {
  return (
    <Dialog {...rest}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className={clsx("sm:w-[425px]", className)}>
        {header && (
          <DialogHeader className="px-7 pt-6 gap-2 flex flex-col">
            <DialogTitle className={clsx("text-[1.75rem] leading-9 text-start", titleSytles)}>
              {title}
            </DialogTitle>
            <DialogDescription
              className={clsx("text-sm leading-5 text-text_03", titleDescriptionStyles)}
            >
              {titleDescription}
            </DialogDescription>
          </DialogHeader>
        )}

        {children}
        {childrenFooter && <DialogFooter>{childrenFooter}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
