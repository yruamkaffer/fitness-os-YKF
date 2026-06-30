import { cn } from "@/utils/cn";

interface TabsProps<T extends string> {
  value: T;
  items: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
  className?: string;
}

export function Tabs<T extends string>({ value, items, onChange, className }: TabsProps<T>) {
  return (
    <div className={cn("inline-flex rounded-md border bg-muted/40 p-1", className)}>
      {items.map((item) => (
        <button
          key={item.value}
          className={cn(
            "h-8 rounded px-3 text-sm font-medium text-muted-foreground transition",
            value === item.value && "bg-card text-foreground shadow-sm"
          )}
          type="button"
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
