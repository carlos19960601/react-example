import { cn } from "@/utils/cn";
import { forwardRef } from "react";

export const TypographyH2 = forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<"h2">
>(({ className, ...props }, ref) => {
  return (
    <h2
      ref={ref}
      {...props}
      className={cn(
        "mt-6 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className
      )}
    />
  );
});

TypographyH2.displayName = "TypographyH2";
