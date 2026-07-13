import { cn } from "@/utils/cn";

interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-muted ring-1 ring-white/5", className)}>
      <div
        className="h-full rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.5)] transition-all duration-500"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
