import { Dumbbell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFitnessOverview } from "@/hooks/useFitnessOverview";
import { formatExerciseHistory, getExerciseHistory } from "@/utils/training-history";

export function WorkoutsPage() {
  const { data } = useFitnessOverview();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Rotina semanal</p>
        <h1 className="text-3xl font-black tracking-normal">Treinos planejados</h1>
        <p className="mt-2 text-muted-foreground">Aqui fica só o plano. Cargas reais entram no treino de hoje.</p>
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
              <Badge>{workout.exercises.length ? `${workout.exercises.length} exercícios` : "sem treino"}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {workout.exercises.length === 0 ? (
                <div className="rounded-md border bg-muted/20 p-4 text-sm text-muted-foreground">Dia sem musculação planejada.</div>
              ) : (
                workout.exercises.map((exercise) => (
                  <div key={exercise.id} className="rounded-md border bg-muted/20 p-3">
                    <p className="font-semibold">{exercise.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {exercise.sets} séries · {exercise.reps} reps · descanso {exercise.restSeconds}s
                    </p>
                    <p className="mt-1 text-xs font-semibold text-primary">{formatExerciseHistory(getExerciseHistory(data.entries, exercise.id, exercise.name))}</p>
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
