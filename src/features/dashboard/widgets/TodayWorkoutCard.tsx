import { Clock, Dumbbell, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkoutPlan } from "@/types/fitness";

interface TodayWorkoutCardProps {
  workout?: WorkoutPlan;
  onDone: () => void;
}

export function TodayWorkoutCard({ workout, onDone }: TodayWorkoutCardProps) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Treino de hoje</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{workout?.label ?? "Hoje"}</p>
        </div>
        <Badge>{workout?.estimatedMinutes ?? 0} min</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-2xl font-black tracking-normal">{workout?.focus ?? "Descanso"}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {workout?.groups.map((group) => <Badge key={group}>{group}</Badge>)}
          </div>
        </div>

        <div className="grid gap-2">
          {(workout?.exercises.slice(0, 5) ?? []).map((exercise) => (
            <div key={exercise.id} className="flex items-center justify-between rounded-md border bg-muted/25 px-3 py-2 text-sm">
              <span>{exercise.name}</span>
              <span className="text-muted-foreground">
                {exercise.sets}x{exercise.reps} · {exercise.load || "BW"}kg
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button className="flex-1" onClick={onDone}>
            <Dumbbell className="h-4 w-4" />
            Treinei hoje
          </Button>
          <Button variant="outline" className="flex-1">
            <Clock className="h-4 w-4" />
            Timer
          </Button>
          <Button variant="secondary" className="flex-1">
            <Flame className="h-4 w-4" />
            Cardio
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
