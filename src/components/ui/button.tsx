import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "relative inline-flex h-10 items-center justify-center gap-2 overflow-hidden rounded-md px-4 text-sm font-semibold transition-[transform,box-shadow,background-color,border-color,color,filter] duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-primary-glow hover:brightness-110",
        secondary: "bg-secondary text-secondary-foreground shadow-secondary-glow hover:brightness-105",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
        outline: "border bg-card/40 hover:border-secondary/50 hover:bg-secondary/10 hover:text-secondary",
        danger: "bg-rose-500 text-white shadow-[0_8px_24px_rgba(244,63,94,0.18)] hover:bg-rose-400"
      },
      size: {
        default: "h-10 px-4",
        icon: "h-10 w-10 px-0",
        sm: "h-8 px-3 text-xs"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
);

Button.displayName = "Button";
