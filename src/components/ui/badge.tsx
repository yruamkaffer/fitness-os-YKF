import * as React from "react";
import { cn } from "@/utils/cn";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border/80 bg-muted/35 px-2 py-1 text-xs font-medium text-muted-foreground transition-colors",
        className
      )}
      {...props}
    />
  );
}
