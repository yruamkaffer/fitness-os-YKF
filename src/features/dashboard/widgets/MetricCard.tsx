import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/cn";

interface MetricCardProps {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: "primary" | "teal" | "coral";
}

const tones = {
  primary: "bg-primary text-primary-foreground",
  teal: "bg-secondary text-secondary-foreground",
  coral: "bg-accent text-accent-foreground"
};

export function MetricCard({ label, value, detail, icon: Icon, tone = "primary" }: MetricCardProps) {
  return (
    <Card className="group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-black tracking-normal transition-colors group-hover:text-primary">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
          </div>
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-md shadow-sm transition duration-300 group-hover:scale-105", tones[tone])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
