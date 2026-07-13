import { useEffect, useState } from "react";
import { Activity, CalendarDays, CheckCircle2, Dumbbell, Flame, Save, Scale } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoadingState } from "@/components/ui/loading-state";
import { FitnessHeatmap } from "@/components/calendar/FitnessHeatmap";
import { WeightTrendChart } from "@/components/charts/WeightTrendChart";
import { VolumeChart } from "@/components/charts/VolumeChart";
import { MetricCard } from "@/features/dashboard/widgets/MetricCard";
import { TodayWorkoutCard } from "@/features/dashboard/widgets/TodayWorkoutCard";
import { useFitnessOverview } from "@/hooks/useFitnessOverview";
import { useSaveFeedback } from "@/hooks/useSaveFeedback";
import { useFitnessStore } from "@/stores/fitness-store";
import { minutes, optionalKg } from "@/utils/format";
import { computeBestStreak, computeCurrentStreak, isCardioDay, isWorkoutDay } from "@/utils/stats";

export function DashboardPage() {
  const { data, isLoading, today, saveEntry } = useFitnessOverview();
  const selectedDay = useFitnessStore((state) => state.selectedDay);
  const setSelectedDay = useFitnessStore((state) => state.setSelectedDay);
  const todayEntry = data.entries.find((entry) => entry.date === today);
  const defaultWeekday = new Date(`${today}T12:00:00`).getDay();
  const [selectedWorkoutWeekday, setSelectedWorkoutWeekday] = useState(defaultWeekday);
  const todayWorkout = data.workoutPlan.find((plan) => plan.weekday === selectedWorkoutWeekday);
  const trainedDays = data.entries.filter(isWorkoutDay).length;
  const cardioDays = data.entries.filter(isCardioDay).length;
  const streak = computeCurrentStreak(data.entries);
  const bestStreak = computeBestStreak(data.entries);
  const week = data.entries.slice(-7);
  const trainingWeek = week.reduce((sum, entry) => sum + (entry.workoutMinutes ?? 0), 0);
  const cardioWeek = week.reduce((sum, entry) => sum + (entry.cardioMinutes ?? 0), 0);
  const totalLoadWeek = week.reduce((sum, entry) => sum + entry.totalLoad, 0);

  useEffect(() => {
    setSelectedWorkoutWeekday(defaultWeekday);
  }, [defaultWeekday]);

  if (isLoading) {
    return <PageLoadingState cards={5} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">FITNESS OS</p>
          <h1 className="text-3xl font-black tracking-normal sm:text-4xl">Treino de hoje</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">Registre treino, peso corporal e cardio em fluxos separados.</p>
        </div>
        <div className="rounded-md border bg-card px-4 py-3 text-sm text-muted-foreground">
          Hoje: <span className="font-semibold text-foreground">{new Date(`${today}T12:00:00`).toLocaleDateString("pt-BR")}</span>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Treino selecionado para hoje</p>
            <p className="text-sm text-muted-foreground">Troque aqui quando fizer outro treino no dia.</p>
          </div>
          <select
            className="h-10 rounded-md border bg-background px-3 text-sm"
            value={selectedWorkoutWeekday}
            onChange={(event) => setSelectedWorkoutWeekday(Number(event.target.value))}
          >
            {data.workoutPlan.map((plan) => (
              <option key={plan.weekday} value={plan.weekday}>
                {plan.label} - {plan.focus}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      <TodayWorkoutCard date={today} workout={todayWorkout} entry={todayEntry} entries={data.entries} onSave={saveEntry} />

      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Registrar peso corporal</CardTitle>
            <p className="text-sm text-muted-foreground">Independente do treino. Escolha qualquer data.</p>
          </CardHeader>
          <CardContent>
            <WeightQuickForm
              defaultDate={today}
              onSave={(date, weight) => {
                const existing = data.entries.find((entry) => entry.date === date);
                saveEntry({ date, weight, status: existing?.status ?? "none" });
              }}
            />
          </CardContent>
        </Card>

        <Card className="border-secondary/50 bg-secondary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-secondary" />
              Registrar cardio
            </CardTitle>
            <p className="text-sm text-muted-foreground">Cardio fica separado e destacado. Escolha data e minutos.</p>
          </CardHeader>
          <CardContent>
            <CardioQuickForm
              defaultDate={today}
              onSave={(date, cardioMinutes) => {
                const existing = data.entries.find((entry) => entry.date === date);
                saveEntry({
                  date,
                  status: existing?.status === "workout" || existing?.status === "both" ? "both" : "cardio",
                  cardioMinutes: (existing?.cardioMinutes ?? 0) + cardioMinutes
                });
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard icon={Scale} label="Peso atual" value={optionalKg(data.profile.currentWeight)} detail="último peso registrado" />
        <MetricCard icon={Dumbbell} label="Treinos salvos" value={`${trainedDays}`} detail={`maior sequência: ${bestStreak} dias`} tone="coral" />
        <MetricCard icon={CalendarDays} label="Sequência atual" value={`${streak} dias`} detail="dias consecutivos reais" />
        <MetricCard icon={Activity} label="Cardio salvo" value={`${cardioDays}`} detail={`${minutes(cardioWeek)} na semana`} tone="teal" />
        <MetricCard icon={Flame} label="Volume semanal" value={`${Math.round(totalLoadWeek).toLocaleString("pt-BR")}kg`} detail={`${minutes(trainingWeek)} treinando`} />
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Calendário estilo GitHub</CardTitle>
            <p className="text-sm text-muted-foreground">Últimos 30 dias. Dias salvos ganham cor.</p>
          </CardHeader>
          <CardContent className="min-w-0 overflow-hidden">
            <FitnessHeatmap entries={data.entries} onSelect={setSelectedDay} />
          </CardContent>
        </Card>
        <VolumeSummaryCard trainingWeek={trainingWeek} cardioWeek={cardioWeek} totalLoadWeek={totalLoadWeek} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evolução de peso</CardTitle>
            <p className="text-sm text-muted-foreground">Só usa pesos que você cadastrou.</p>
          </CardHeader>
          <CardContent>
            <WeightTrendChart entries={data.entries} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Volume e cardio</CardTitle>
            <p className="text-sm text-muted-foreground">Só usa treinos e cardios salvos.</p>
          </CardHeader>
          <CardContent>
            <VolumeChart entries={data.entries} />
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
                ["Tempo", selectedDay.workoutMinutes ? minutes(selectedDay.workoutMinutes) : "--"],
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

function CardioQuickForm({
  defaultDate,
  onSave
}: {
  defaultDate: string;
  onSave: (date: string, minutes: number) => void;
}) {
  const [date, setDate] = useState(defaultDate);
  const [minutesValue, setMinutesValue] = useState("");
  const { isVisible: savedFlash, trigger: showSavedFeedback } = useSaveFeedback();

  function save() {
    const parsed = Number(minutesValue);
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    onSave(date, parsed);
    setMinutesValue("");
    showSavedFeedback();
  }

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
      <input className="h-11 rounded-md border bg-background px-3 text-sm" value={date} type="date" onChange={(event) => setDate(event.target.value)} />
      <input
        className="h-11 rounded-md border bg-background px-3 text-sm"
        inputMode="numeric"
        placeholder="minutos de cardio"
        value={minutesValue}
        onChange={(event) => setMinutesValue(event.target.value)}
      />
      <Button
        variant="secondary"
        className={savedFlash ? "h-11 motion-safe:animate-save-pop" : "h-11"}
        type="button"
        onClick={save}
      >
        <span className="inline-flex items-center gap-2">
          {savedFlash ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {savedFlash ? "Cardio somado" : "Salvar cardio"}
        </span>
      </Button>
    </div>
  );
}

function WeightQuickForm({ defaultDate, onSave }: { defaultDate: string; onSave: (date: string, weight: number) => void }) {
  const [date, setDate] = useState(defaultDate);
  const [weightValue, setWeightValue] = useState("");
  const { isVisible: savedFlash, trigger: showSavedFeedback } = useSaveFeedback();

  function save() {
    const parsed = Number(weightValue.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    onSave(date, parsed);
    setWeightValue("");
    showSavedFeedback();
  }

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] xl:grid-cols-1">
      <input className="h-11 rounded-md border bg-background px-3 text-sm" value={date} type="date" onChange={(event) => setDate(event.target.value)} />
      <input
        className="h-11 rounded-md border bg-background px-3 text-sm"
        inputMode="decimal"
        placeholder="peso corporal"
        value={weightValue}
        onChange={(event) => setWeightValue(event.target.value)}
      />
      <Button className={savedFlash ? "h-11 motion-safe:animate-save-pop" : "h-11"} type="button" onClick={save}>
        {savedFlash ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
        {savedFlash ? "Peso registrado" : "Salvar peso"}
      </Button>
    </div>
  );
}

function VolumeSummaryCard({
  trainingWeek,
  cardioWeek,
  totalLoadWeek
}: {
  trainingWeek: number;
  cardioWeek: number;
  totalLoadWeek: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo da semana</CardTitle>
        <p className="text-sm text-muted-foreground">Apenas registros salvos por você.</p>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-1">
        {[
          ["Treino", minutes(trainingWeek)],
          ["Cardio", minutes(cardioWeek)],
          ["Volume", `${Math.round(totalLoadWeek).toLocaleString("pt-BR")}kg`]
        ].map(([label, value]) => (
          <div key={label} className="min-w-0 rounded-md border bg-muted/20 p-3 last:col-span-2 sm:last:col-span-1">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 break-words text-base font-black tracking-normal sm:text-lg">{value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
