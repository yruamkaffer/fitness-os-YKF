import { CalendarCheck, CheckCircle2, Moon, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { DailyEntry, Goal } from "@/types/fitness";

interface WeeklySummaryProps {
  entries: DailyEntry[];
  goals: Goal[];
}

export function WeeklySummary({ entries, goals }: WeeklySummaryProps) {
  const week = entries.slice(-7);
  const trained = week.filter((entry) => entry.workoutMinutes > 0).length;
  const cardio = week.filter((entry) => entry.cardioMinutes > 0).length;
  const perfect = week.filter((entry) => entry.workoutMinutes > 0 && entry.waterLiters >= 2.8 && entry.sleepHours >= 7).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo da semana</CardTitle>
        <p className="text-sm text-muted-foreground">Consistência, hábitos e metas ativas</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          { icon: CalendarCheck, label: "Treinos", value: trained, target: 5 },
          { icon: Target, label: "Cardios", value: cardio, target: 3 },
          { icon: Moon, label: "Sono 7h+", value: week.filter((entry) => entry.sleepHours >= 7).length, target: 7 },
          { icon: CheckCircle2, label: "Dias perfeitos", value: perfect, target: 5 }
        ].map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <item.icon className="h-4 w-4 text-primary" />
                {item.label}
              </span>
              <span className="text-muted-foreground">
                {item.value}/{item.target}
              </span>
            </div>
            <Progress value={(item.value / item.target) * 100} />
          </div>
        ))}
        <div className="grid grid-cols-2 gap-2 pt-2">
          {goals.slice(0, 4).map((goal) => (
            <div key={goal.id} className="rounded-md border bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground">{goal.label}</p>
              <p className="mt-1 text-sm font-semibold">
                {goal.current} / {goal.target} {goal.unit}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
