import { differenceInCalendarDays, parseISO, subDays } from "date-fns";
import { Activity, CalendarDays, Flame, Scale, Target, Timer } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FitnessHeatmap } from "@/components/calendar/FitnessHeatmap";
import { WeightTrendChart } from "@/components/charts/WeightTrendChart";
import { VolumeChart } from "@/components/charts/VolumeChart";
import { CoachCard } from "@/features/dashboard/widgets/CoachCard";
import { MetricCard } from "@/features/dashboard/widgets/MetricCard";
import { QuickEntryCard } from "@/features/dashboard/widgets/QuickEntryCard";
import { TodayWorkoutCard } from "@/features/dashboard/widgets/TodayWorkoutCard";
import { WeeklySummary } from "@/features/dashboard/widgets/WeeklySummary";
import { useFitnessOverview } from "@/hooks/useFitnessOverview";
import { generateDailyCoachReport } from "@/services/coach.service";
import { useFitnessStore } from "@/stores/fitness-store";
import { kg, minutes, optionalKg } from "@/utils/format";
import { computeBestStreak, computeCurrentStreak, isCardioDay, isWorkoutDay } from "@/utils/stats";

function optionalMetric(value: number | null | undefined, formatter: (value: number) => string = (value) => String(value)) {
  return value === null || value === undefined || Number.isNaN(value) ? "--" : formatter(value);
}

export function DashboardPage() {
  const { data, isLoading, today, saveProfile, saveEntry, markTodayTrained } = useFitnessOverview();
  const selectedDay = useFitnessStore((state) => state.selectedDay);
  const setSelectedDay = useFitnessStore((state) => state.setSelectedDay);

  if (isLoading || !data) {
    return <div className="rounded-lg border bg-card p-6">Carregando FITNESS OS...</div>;
  }

  const todayEntry = data.entries.find((entry) => entry.date === today);
  const yesterdayDate = subDays(new Date(`${today}T12:00:00`), 1).toISOString().slice(0, 10);
  const yesterday = data.entries.find((entry) => entry.date === yesterdayDate);
  const todayWorkout = data.workoutPlan.find((plan) => plan.weekday === new Date(`${today}T12:00:00`).getDay());
  const currentWeight = data.profile.currentWeight;
  const lost =
    data.profile.startWeight !== null && currentWeight !== null ? Math.max(0, data.profile.startWeight - currentWeight) : null;
  const remaining =
    currentWeight !== null && data.profile.goalWeight !== null ? Math.abs(currentWeight - data.profile.goalWeight) : null;
  const trainedDays = data.entries.filter(isWorkoutDay).length;
  const streak = computeCurrentStreak(data.entries);
  const maxStreak = computeBestStreak(data.entries);
  const week = data.entries.slice(-7);
  const cardioWeek = week.reduce((sum, entry) => sum + entry.cardioMinutes, 0);
  const trainingWeek = week.reduce((sum, entry) => sum + entry.workoutMinutes, 0);
  const coachReport = generateDailyCoachReport({
    profile: data.profile,
    today: todayEntry,
    yesterday,
    workout: todayWorkout,
    streak,
    entriesCount: data.entries.length
  });
  const daysTraining = data.profile.startedAt
    ? Math.max(0, differenceInCalendarDays(new Date(`${today}T12:00:00`), parseISO(data.profile.startedAt)))
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Dashboard pessoal</p>
          <h1 className="text-3xl font-black tracking-normal sm:text-4xl">FITNESS OS</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Sistema operacional de treino, cardio, peso, evolução corporal e hábitos de consistência.
          </p>
        </div>
        <div className="rounded-md border bg-card px-4 py-3 text-sm text-muted-foreground">
          Objetivo atual:{" "}
          <span className="font-semibold text-foreground">
            {data.profile.goalWeight !== null ? `chegar a ${kg(data.profile.goalWeight)}` : "configure sua meta"}
          </span>
        </div>
      </div>

      <QuickEntryCard profile={data.profile} today={today} onSaveProfile={saveProfile} onSaveEntry={saveEntry} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Scale} label="Peso atual" value={optionalKg(currentWeight)} detail={`Meta ${optionalKg(data.profile.goalWeight)}`} />
        <MetricCard icon={Target} label="Peso perdido" value={optionalMetric(lost, kg)} detail={`${optionalMetric(remaining, kg)} restantes`} tone="teal" />
        <MetricCard icon={Activity} label="Dias treinados" value={`${trainedDays}`} detail={`Maior sequência: ${maxStreak} dias`} tone="coral" />
        <MetricCard icon={CalendarDays} label="Sequência atual" value={`${streak} dias`} detail={`${daysTraining} dias desde o início`} />
        <MetricCard icon={Flame} label="Cardio da semana" value={minutes(cardioWeek)} detail={`${week.filter(isCardioDay).length} sessão(ões)`} tone="teal" />
        <MetricCard icon={Timer} label="Tempo treinando" value={minutes(trainingWeek)} detail="Acumulado semanal" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <CoachCard report={coachReport} />
        <TodayWorkoutCard workout={todayWorkout} onDone={markTodayTrained} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Calendário de atividade</CardTitle>
            <p className="text-sm text-muted-foreground">Treino, cardio, descanso, viagem e doença por dia</p>
          </CardHeader>
          <CardContent>
            {data.entries.length === 0 ? (
              <div className="rounded-md border bg-muted/20 p-6 text-sm text-muted-foreground">
                Nenhum dia registrado ainda. Salve seu primeiro registro acima para iniciar o histórico.
              </div>
            ) : (
              <FitnessHeatmap entries={data.entries} onSelect={setSelectedDay} />
            )}
          </CardContent>
        </Card>
        <WeeklySummary entries={data.entries} goals={data.goals} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evolução de peso</CardTitle>
            <p className="text-sm text-muted-foreground">Gráfico baseado apenas nos pesos que você registrar</p>
          </CardHeader>
          <CardContent>
            <WeightTrendChart entries={data.entries} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Volume semanal e cardio</CardTitle>
            <p className="text-sm text-muted-foreground">Carga total levantada e minutos de cardio</p>
          </CardHeader>
          <CardContent>
            <VolumeChart entries={data.entries} />
          </CardContent>
        </Card>
      </div>

      <Dialog open={Boolean(selectedDay)} title={selectedDay?.date ?? "Dia"} onClose={() => setSelectedDay(undefined)}>
        {selectedDay && (
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Peso", optionalKg(selectedDay.weight)],
              ["Treino", minutes(selectedDay.workoutMinutes)],
              ["Cardio", minutes(selectedDay.cardioMinutes)],
              ["Humor", selectedDay.mood ? `${selectedDay.mood}/5` : "--"],
              ["Energia", selectedDay.energy ? `${selectedDay.energy}/5` : "--"],
              ["Carga total", `${selectedDay.totalLoad.toLocaleString("pt-BR")}kg`],
              ["Observações", selectedDay.notes || "Sem observações"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 font-semibold">{value}</p>
              </div>
            ))}
          </div>
        )}
      </Dialog>
    </div>
  );
}
