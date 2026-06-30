import { CalendarCheck, Target, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { DailyEntry, Goal } from "@/types/fitness";
import { isCardioDay, isWorkoutDay } from "@/utils/stats";

interface WeeklySummaryProps {
  entries: DailyEntry[];
  goals: Goal[];
}

export function WeeklySummary({ entries, goals }: WeeklySummaryProps) {
  const week = entries.slice(-7);
  const trained = week.filter(isWorkoutDay).length;
  const cardio = week.filter(isCardioDay).length;
  const trainingMinutes = week.reduce((sum, entry) => sum + entry.workoutMinutes, 0);

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resumo da semana</CardTitle>
          <p className="text-sm text-muted-foreground">Sem registros ainda.</p>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Quando você registrar treino, cardio ou peso, este painel passa a calcular sua semana com dados reais.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo da semana</CardTitle>
        <p className="text-sm text-muted-foreground">Treinos, cardio e volume registrado</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          { icon: CalendarCheck, label: "Treinos", value: trained, target: goals.find((goal) => goal.id === "workouts")?.target ?? 5 },
          { icon: Target, label: "Cardios", value: cardio, target: goals.find((goal) => goal.id === "cardio")?.target ?? 3 },
          { icon: Timer, label: "Horas de treino", value: Math.round(trainingMinutes / 60), target: 5 }
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
          {goals.map((goal) => (
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
