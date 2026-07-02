import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Activity, CalendarDays, Dumbbell, Flame, Plus, Save, Timer, Trash2, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FitnessHeatmap } from "@/components/calendar/FitnessHeatmap";
import { useFitnessOverview } from "@/hooks/useFitnessOverview";
import { useFitnessStore } from "@/stores/fitness-store";
import type { DailyEntry, ExerciseLog } from "@/types/fitness";
import { minutes, optionalKg } from "@/utils/format";
import { computeBestStreak, computeCurrentStreak, isCardioDay, isWorkoutDay } from "@/utils/stats";

function toNumber(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function logsFromEntryOrPlan(entry: DailyEntry | undefined, plan: ReturnType<typeof useFitnessOverview>["data"]["workoutPlan"][number] | undefined) {
  if (entry?.exerciseLogs.length) return entry.exerciseLogs;
  return (plan?.exercises ?? []).map((exercise) => ({
    exerciseId: exercise.id,
    name: exercise.name,
    sets: exercise.sets,
    reps: "",
    load: null
  }));
}

export function CalendarPage() {
  const { data, today, saveEntry, removeEntry } = useFitnessOverview();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDay = useFitnessStore((state) => state.selectedDay);
  const setSelectedDay = useFitnessStore((state) => state.setSelectedDay);
  const [date, setDate] = useState(searchParams.get("date") ?? today);
  const existing = data.entries.find((entry) => entry.date === date);
  const defaultPlanWeekday = new Date(`${date}T12:00:00`).getDay();
  const [planWeekday, setPlanWeekday] = useState(defaultPlanWeekday);
  const plan = data.workoutPlan.find((item) => item.weekday === planWeekday);
  const [weight, setWeight] = useState("");
  const [workoutMinutes, setWorkoutMinutes] = useState("");
  const [cardioMinutes, setCardioMinutes] = useState("");
  const [notes, setNotes] = useState("");
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  const workoutEntries = data.entries.filter(isWorkoutDay);
  const cardioEntries = data.entries.filter(isCardioDay);
  const totalWorkoutMinutes = data.entries.reduce((sum, entry) => sum + (entry.workoutMinutes ?? 0), 0);
  const totalCardioMinutes = data.entries.reduce((sum, entry) => sum + (entry.cardioMinutes ?? 0), 0);
  const totalLoadSaved = data.entries.reduce((sum, entry) => sum + entry.totalLoad, 0);
  const totalExerciseLogs = data.entries.reduce((sum, entry) => sum + entry.exerciseLogs.length, 0);
  const bestVolumeDay = data.entries.reduce<DailyEntry | undefined>((best, entry) => (!best || entry.totalLoad > best.totalLoad ? entry : best), undefined);

  useEffect(() => {
    if (selectedDay) setDate(selectedDay.date);
  }, [selectedDay]);

  useEffect(() => {
    const queryDate = searchParams.get("date");
    if (queryDate) setDate(queryDate);
  }, [searchParams]);

  useEffect(() => {
    setPlanWeekday(defaultPlanWeekday);
  }, [defaultPlanWeekday]);

  useEffect(() => {
    setWeight(existing?.weight?.toString() ?? "");
    setWorkoutMinutes(existing?.workoutMinutes?.toString() ?? "");
    setCardioMinutes(existing?.cardioMinutes?.toString() ?? "");
    setNotes(existing?.notes ?? "");
    setLogs(logsFromEntryOrPlan(existing, plan));
  }, [date, existing, plan]);

  function changeDate(nextDate: string) {
    setDate(nextDate);
    setSearchParams({ date: nextDate });
  }

  function changePlan(nextWeekday: number) {
    const nextPlan = data.workoutPlan.find((item) => item.weekday === nextWeekday);
    setPlanWeekday(nextWeekday);
    setLogs(logsFromEntryOrPlan(existing, nextPlan));
  }

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

  function addExercise() {
    const id = `custom-${Date.now()}`;
    setLogs((current) => [...current, { exerciseId: id, name: "Novo exercício", sets: 3, reps: "", load: null }]);
  }

  function removeExercise(exerciseId: string) {
    setLogs((current) => current.filter((log) => log.exerciseId !== exerciseId));
  }

  function saveRecord() {
    const cardio = toNumber(cardioMinutes);
    const workout = toNumber(workoutMinutes);
    const exerciseLogs = logs.filter((log) => log.name.trim() && (log.reps.trim() || log.load !== null));
    const hasWorkout = exerciseLogs.length > 0 || (workout ?? 0) > 0;
    const hasCardio = (cardio ?? 0) > 0;

    saveEntry({
      date,
      status: hasWorkout && hasCardio ? "both" : hasWorkout ? "workout" : hasCardio ? "cardio" : existing?.status ?? "none",
      weight: toNumber(weight),
      workoutMinutes: workout,
      cardioMinutes: cardio,
      exerciseLogs,
      notes
    });
  }

  function deleteRecord() {
    if (!existing) return;
    const confirmed = window.confirm(`Excluir o registro de ${new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR")}?`);
    if (confirmed) removeEntry(date);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Calendário</p>
        <h1 className="text-3xl font-black tracking-normal">Histórico de treinos</h1>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Treinos", value: `${workoutEntries.length}`, detail: `${totalExerciseLogs} exercícios registrados`, icon: Dumbbell },
          { label: "Cardio", value: `${cardioEntries.length}`, detail: `${minutes(totalCardioMinutes)} totais`, icon: Activity },
          { label: "Volume total", value: `${Math.round(totalLoadSaved).toLocaleString("pt-BR")}kg`, detail: `${minutes(totalWorkoutMinutes)} treinando`, icon: Flame },
          { label: "Sequência", value: `${computeCurrentStreak(data.entries)} dias`, detail: `melhor: ${computeBestStreak(data.entries)} dias`, icon: CalendarDays }
        ].map(({ label, value, detail, icon: Icon }) => (
          <Card key={label} className="min-w-0">
            <CardContent className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 break-words text-xl font-black tracking-normal">{value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
              </div>
              <Icon className="h-5 w-5 shrink-0 text-primary" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="min-w-0">
          <CardContent className="flex items-center justify-between gap-3 p-4">
            <div>
              <p className="text-xs text-muted-foreground">Melhor dia de volume</p>
              <p className="mt-1 text-lg font-black tracking-normal">
                {bestVolumeDay && bestVolumeDay.totalLoad > 0 ? `${Math.round(bestVolumeDay.totalLoad).toLocaleString("pt-BR")}kg` : "--"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {bestVolumeDay && bestVolumeDay.totalLoad > 0 ? new Date(`${bestVolumeDay.date}T12:00:00`).toLocaleDateString("pt-BR") : "Sem treino com carga ainda"}
              </p>
            </div>
            <Trophy className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardContent className="flex items-center justify-between gap-3 p-4">
            <div>
              <p className="text-xs text-muted-foreground">Média por treino</p>
              <p className="mt-1 text-lg font-black tracking-normal">
                {workoutEntries.length > 0 ? `${Math.round(totalLoadSaved / workoutEntries.length).toLocaleString("pt-BR")}kg` : "--"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">volume médio nos dias de treino</p>
            </div>
            <Timer className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 2xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Calendário estilo GitHub</CardTitle>
            <p className="text-sm text-muted-foreground">Últimos 30 dias. Os quadrados ganham cor quando você salva treino, cardio ou descanso.</p>
          </CardHeader>
          <CardContent className="min-w-0 overflow-hidden">
            <FitnessHeatmap entries={data.entries} onSelect={setSelectedDay} />
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Cadastrar por data</CardTitle>
            <p className="text-sm text-muted-foreground">{plan ? `${plan.label} · ${plan.focus}` : "Sem treino planejado para esta data."}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-4">
              <label className="space-y-1 text-sm">
                <span className="text-muted-foreground">Data</span>
                <input className="h-10 w-full rounded-md border bg-background px-3" type="date" value={date} onChange={(event) => changeDate(event.target.value)} />
              </label>
              <label className="space-y-1 text-sm">
                <span className="text-muted-foreground">Peso</span>
                <input className="h-10 w-full rounded-md border bg-background px-3" inputMode="decimal" value={weight} onChange={(event) => setWeight(event.target.value)} />
              </label>
              <label className="space-y-1 text-sm">
                <span className="text-muted-foreground">Treino min</span>
                <input className="h-10 w-full rounded-md border bg-background px-3" inputMode="numeric" value={workoutMinutes} onChange={(event) => setWorkoutMinutes(event.target.value)} />
              </label>
              <label className="space-y-1 text-sm">
                <span className="text-muted-foreground">Cardio min</span>
                <input className="h-10 w-full rounded-md border bg-background px-3" inputMode="numeric" value={cardioMinutes} onChange={(event) => setCardioMinutes(event.target.value)} />
              </label>
            </div>

            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Treino do dia</span>
              <select className="h-10 w-full rounded-md border bg-background px-3" value={planWeekday} onChange={(event) => changePlan(Number(event.target.value))}>
                {data.workoutPlan.map((item) => (
                  <option key={item.weekday} value={item.weekday}>
                    {item.label} - {item.focus}
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-md border">
              <div className="flex items-center justify-between border-b px-3 py-2">
                <div>
                  <p className="font-semibold">Exercícios e cargas</p>
                  <p className="text-xs text-muted-foreground">Volume atual: {Math.round(totalLoad).toLocaleString("pt-BR")}kg</p>
                </div>
                <Button variant="outline" size="sm" onClick={addExercise} type="button">
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
              </div>
              <div className="max-h-[420px] space-y-2 overflow-y-auto p-3">
                {logs.length === 0 ? (
                  <div className="rounded-md bg-muted/20 p-3 text-sm text-muted-foreground">Adicione um exercício para registrar treino nesta data.</div>
                ) : (
                  logs.map((log) => (
                    <div key={log.exerciseId} className="grid min-w-0 gap-2 rounded-md bg-muted/20 p-2 sm:grid-cols-[minmax(0,1.4fr)_minmax(70px,0.5fr)_minmax(90px,0.7fr)_minmax(90px,0.7fr)_auto]">
                      <input className="h-9 min-w-0 rounded-md border bg-background px-2 text-sm" value={log.name} onChange={(event) => updateLog(log.exerciseId, { name: event.target.value })} />
                      <input
                        className="h-9 min-w-0 rounded-md border bg-background px-2 text-sm"
                        inputMode="numeric"
                        value={log.sets}
                        onChange={(event) => updateLog(log.exerciseId, { sets: Number(event.target.value) || 0 })}
                      />
                      <input className="h-9 min-w-0 rounded-md border bg-background px-2 text-sm" placeholder="reps" inputMode="decimal" value={log.reps} onChange={(event) => updateLog(log.exerciseId, { reps: event.target.value })} />
                      <input
                        className="h-9 min-w-0 rounded-md border bg-background px-2 text-sm"
                        placeholder="kg"
                        inputMode="decimal"
                        value={log.load ?? ""}
                        onChange={(event) => updateLog(log.exerciseId, { load: toNumber(event.target.value) })}
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeExercise(log.exerciseId)} type="button" aria-label="Remover exercício">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <textarea className="min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm" placeholder="Observações" value={notes} onChange={(event) => setNotes(event.target.value)} />

            <div className="flex flex-wrap gap-2">
              <Button onClick={saveRecord} type="button">
                <Save className="h-4 w-4" />
                Salvar registro
              </Button>
              <Button variant="danger" onClick={deleteRecord} disabled={!existing} type="button">
                <Trash2 className="h-4 w-4" />
                Excluir data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={Boolean(selectedDay)} title={selectedDay?.date ?? "Dia"} onClose={() => setSelectedDay(undefined)}>
        {selectedDay && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Peso", optionalKg(selectedDay.weight)],
                ["Treino", selectedDay.status === "workout" || selectedDay.status === "both" ? "feito" : "não registrado"],
                ["Tempo de treino", selectedDay.workoutMinutes ? minutes(selectedDay.workoutMinutes) : "--"],
                ["Cardio", selectedDay.cardioMinutes ? minutes(selectedDay.cardioMinutes) : "--"],
                ["Volume", `${Math.round(selectedDay.totalLoad).toLocaleString("pt-BR")}kg`],
                ["Observações", selectedDay.notes || "Sem observações"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-md border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="mt-1 font-semibold">{value}</p>
                </div>
              ))}
            </div>
            {selectedDay.exerciseLogs.length > 0 && (
              <div className="rounded-md border">
                {selectedDay.exerciseLogs.map((log) => (
                  <div key={log.exerciseId} className="flex items-center justify-between border-b px-3 py-2 text-sm last:border-b-0">
                    <span>{log.name}</span>
                    <span className="text-muted-foreground">
                      {log.sets}x{log.reps || "--"} · {log.load ? `${log.load}kg` : "--"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
}
