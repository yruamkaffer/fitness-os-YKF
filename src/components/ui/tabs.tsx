import { cn } from "@/utils/cn";

interface TabsProps<T extends string> {
  value: T;
  items: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
  className?: string;
}

export function Tabs<T extends string>({ value, items, onChange, className }: TabsProps<T>) {
  return (
    <div className={cn("inline-flex max-w-full overflow-x-auto rounded-md border bg-muted/40 p-1", className)} role="tablist">
      {items.map((item) => (
        <button
          key={item.value}
          className={cn(
            "h-8 shrink-0 rounded px-3 text-sm font-medium text-muted-foreground transition duration-200 hover:text-foreground",
            value === item.value && "bg-primary/15 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25),0_0_18px_hsl(var(--primary)/0.08)]"
          )}
          type="button"
          role="tab"
          aria-selected={value === item.value}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
