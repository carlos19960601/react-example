import { cn } from "@/utils/cn";
import { forwardRef } from "react";

export const TypographyP = forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<"p">
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      {...props}
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
    />
  );
});

TypographyP.displayName = "TypographyP";
