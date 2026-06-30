import { Dumbbell, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFitnessOverview } from "@/hooks/useFitnessOverview";

export function WorkoutsPage() {
  const { data } = useFitnessOverview();
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Rotina semanal</p>
        <h1 className="text-3xl font-black tracking-normal">Treinos</h1>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {data.workoutPlan.map((workout) => (
          <Card key={workout.weekday}>
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-primary" />
                  {workout.label}
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">{workout.focus}</p>
              </div>
              <Badge>{workout.estimatedMinutes} min</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {workout.exercises.length === 0 ? (
                <div className="rounded-md border bg-muted/20 p-4 text-sm text-muted-foreground">Descanso planejado.</div>
              ) : (
                workout.exercises.map((exercise) => (
                  <div key={exercise.id} className="rounded-md border bg-muted/20 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{exercise.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {exercise.sets} séries · {exercise.reps} reps · RPE {exercise.rpe} · descanso {exercise.restSeconds}s
                        </p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-semibold">{exercise.load || "BW"}kg</p>
                        <p className="flex items-center justify-end gap-1 text-muted-foreground">
                          <TrendingUp className="h-3 w-3" />
                          PR {exercise.pr}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
