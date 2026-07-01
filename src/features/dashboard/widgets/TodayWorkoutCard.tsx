import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Dumbbell, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailyEntry, ExerciseLog, WorkoutPlan } from "@/types/fitness";
import { cn } from "@/utils/cn";
import { formatExerciseHistory, getExerciseHistory } from "@/utils/training-history";

interface TodayWorkoutCardProps {
  date: string;
  workout?: WorkoutPlan;
  entry?: DailyEntry;
  entries: DailyEntry[];
  onSave: (entry: {
    date: string;
    status: "workout" | "both";
    workoutMinutes: number | null;
    exerciseLogs: ExerciseLog[];
    notes: string;
  }) => void;
}

function toNumber(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function initialLogs(workout?: WorkoutPlan, entry?: DailyEntry): ExerciseLog[] {
  const workoutExerciseIds = new Set((workout?.exercises ?? []).map((exercise) => exercise.id));
  const entryMatchesWorkout =
    entry?.exerciseLogs?.length &&
    (workoutExerciseIds.size === 0 || entry.exerciseLogs.every((log) => workoutExerciseIds.has(log.exerciseId)));

  if (entryMatchesWorkout) return entry.exerciseLogs;
  return (workout?.exercises ?? []).map((exercise) => ({
    exerciseId: exercise.id,
    name: exercise.name,
    sets: exercise.sets,
    reps: "",
    load: null
  }));
}

export function TodayWorkoutCard({ date, workout, entry, entries, onSave }: TodayWorkoutCardProps) {
  const [minutes, setMinutes] = useState(entry?.workoutMinutes?.toString() ?? "");
  const [notes, setNotes] = useState(entry?.notes ?? "");
  const [logs, setLogs] = useState<ExerciseLog[]>(() => initialLogs(workout, entry));
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setMinutes(entry?.workoutMinutes?.toString() ?? "");
    setNotes(entry?.notes ?? "");
    setLogs(initialLogs(workout, entry));
  }, [entry, workout]);

  const totalLoad = useMemo(
    () =>
      logs.reduce((sum, log) => {
        const reps = Number.parseFloat(log.reps.replace(",", "."));
        if (!Number.isFinite(reps) || reps <= 0 || !log.load || log.load <= 0 || log.sets <= 0) return sum;
        return sum + log.sets * reps * log.load;
      }, 0),
    [logs]
  );

  function updateLog(exerciseId: string, patch: Partial<ExerciseLog>) {
    setLogs((current) => current.map((log) => (log.exerciseId === exerciseId ? { ...log, ...patch } : log)));
  }

  function saveWorkout() {
    onSave({
      date,
      status: entry?.status === "cardio" || entry?.status === "both" ? "both" : "workout",
      workoutMinutes: toNumber(minutes),
      exerciseLogs: logs.filter((log) => log.reps.trim() || log.load !== null),
      notes
    });
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1100);
  }

  return (
    <Card className={cn("border-primary/30 transition", (savedFlash || entry?.status === "workout" || entry?.status === "both") && "shadow-[0_0_0_1px_hsl(var(--primary)/0.45)]")}>
      <CardHeader>
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Dumbbell className="h-5 w-5 text-primary" />
            Treino de hoje
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{workout?.label ?? "Hoje"} · {workout?.focus ?? "Sem treino planejado"}</p>
        </div>
        {entry?.status === "workout" || entry?.status === "both" ? (
          <Badge className="border-primary/40 text-primary motion-safe:animate-pulse">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            registrado
          </Badge>
        ) : (
          <Badge>pendente</Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Tempo de treino</span>
            <input className="h-10 w-full rounded-md border bg-background px-3" inputMode="numeric" placeholder="minutos" value={minutes} onChange={(event) => setMinutes(event.target.value)} />
          </label>
          <div className="rounded-md border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Volume calculado</p>
            <p className="mt-1 text-lg font-black tracking-normal">{Math.round(totalLoad).toLocaleString("pt-BR")}kg</p>
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="rounded-md border bg-muted/20 p-4 text-sm text-muted-foreground">
            Hoje não tem exercícios de musculação planejados. Use o campo de observações ou registre cardio no painel abaixo.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-muted/30 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-3">Exercício</th>
                  <th className="px-3 py-3">Séries</th>
                  <th className="px-3 py-3">Reps feitas</th>
                  <th className="px-3 py-3">Carga kg</th>
                  <th className="px-3 py-3">Descanso</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const template = workout?.exercises.find((exercise) => exercise.id === log.exerciseId);
                  const history = getExerciseHistory(entries, log.exerciseId, log.name, date);
                  return (
                    <tr key={log.exerciseId} className="border-t">
                      <td className="px-3 py-3 font-medium">
                        {log.name}
                        <p className="text-xs font-normal text-muted-foreground">Planejado: {template?.sets ?? log.sets}x{template?.reps ?? "-"}</p>
                        <p className="text-xs font-normal text-primary">{formatExerciseHistory(history)}</p>
                      </td>
                      <td className="px-3 py-3">
                        <input className="h-9 w-20 rounded-md border bg-background px-2" inputMode="numeric" value={log.sets} onChange={(event) => updateLog(log.exerciseId, { sets: Number(event.target.value) || 0 })} />
                      </td>
                      <td className="px-3 py-3">
                        <input className="h-9 w-28 rounded-md border bg-background px-2" placeholder="ex: 8" inputMode="decimal" value={log.reps} onChange={(event) => updateLog(log.exerciseId, { reps: event.target.value })} />
                      </td>
                      <td className="px-3 py-3">
                        <input className="h-9 w-28 rounded-md border bg-background px-2" placeholder="ex: 40" inputMode="decimal" value={log.load ?? ""} onChange={(event) => updateLog(log.exerciseId, { load: toNumber(event.target.value) })} />
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">{template?.restSeconds ?? 90}s</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <textarea
          className="min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm"
          placeholder="Observações do treino"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />

        <Button className={cn("w-full sm:w-auto", savedFlash && "motion-safe:animate-pulse")} onClick={saveWorkout} type="button">
          {savedFlash || entry?.status === "workout" || entry?.status === "both" ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {savedFlash ? "Treino registrado" : "Salvar treino de hoje"}
        </Button>
      </CardContent>
    </Card>
  );
}
