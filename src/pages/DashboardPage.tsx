import { differenceInCalendarDays, parseISO } from "date-fns";
import { Activity, CalendarDays, Droplets, Flame, Moon, Scale, Target, Timer } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FitnessHeatmap } from "@/components/calendar/FitnessHeatmap";
import { WeightTrendChart } from "@/components/charts/WeightTrendChart";
import { VolumeChart } from "@/components/charts/VolumeChart";
import { CoachCard } from "@/features/dashboard/widgets/CoachCard";
import { MetricCard } from "@/features/dashboard/widgets/MetricCard";
import { NutritionWidget } from "@/features/dashboard/widgets/NutritionWidget";
import { TodayWorkoutCard } from "@/features/dashboard/widgets/TodayWorkoutCard";
import { WeeklySummary } from "@/features/dashboard/widgets/WeeklySummary";
import { useFitnessOverview } from "@/hooks/useFitnessOverview";
import { generateDailyCoachReport } from "@/services/coach.service";
import { useFitnessStore } from "@/stores/fitness-store";
import { kg, liters, minutes } from "@/utils/format";

function computeStreak(entries: { workoutMinutes: number; cardioMinutes: number }[]) {
  let streak = 0;
  for (let index = entries.length - 1; index >= 0; index -= 1) {
    const entry = entries[index];
    if (entry.workoutMinutes || entry.cardioMinutes) streak += 1;
    else break;
  }
  return streak;
}

export function DashboardPage() {
  const { data, isLoading } = useFitnessOverview();
  const selectedDay = useFitnessStore((state) => state.selectedDay);
  const setSelectedDay = useFitnessStore((state) => state.setSelectedDay);
  const markTodayTrained = useFitnessStore((state) => state.markTodayTrained);

  if (isLoading || !data) {
    return <div className="rounded-lg border bg-card p-6">Carregando FITNESS OS...</div>;
  }

  const today = data.entries[data.entries.length - 1];
  const yesterday = data.entries[data.entries.length - 2];
  const todayWorkout = data.workoutPlan.find((plan) => plan.weekday === new Date(`${today.date}T12:00:00`).getDay());
  const lost = data.profile.startWeight - data.profile.currentWeight;
  const remaining = data.profile.currentWeight - data.profile.goalWeight;
  const trainedDays = data.entries.filter((entry) => entry.workoutMinutes > 0).length;
  const streak = computeStreak(data.entries);
  const maxStreak = 19;
  const week = data.entries.slice(-7);
  const cardioWeek = week.reduce((sum, entry) => sum + entry.cardioMinutes, 0);
  const trainingWeek = week.reduce((sum, entry) => sum + entry.workoutMinutes, 0);
  const coachReport = generateDailyCoachReport({
    profile: data.profile,
    today,
    yesterday,
    workout: todayWorkout,
    nutrition: data.nutrition,
    streak
  });
  const daysTraining = differenceInCalendarDays(parseISO(today.date), parseISO(data.profile.startedAt));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Dashboard pessoal</p>
          <h1 className="text-3xl font-black tracking-normal sm:text-4xl">FITNESS OS</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Sistema operacional de treino, dieta, saúde, evolução corporal e hábitos.
          </p>
        </div>
        <div className="rounded-md border bg-card px-4 py-3 text-sm text-muted-foreground">
          Objetivo atual: <span className="font-semibold text-foreground">chegar a {kg(data.profile.goalWeight)}</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Scale} label="Peso atual" value={kg(data.profile.currentWeight)} detail={`Meta ${kg(data.profile.goalWeight)}`} />
        <MetricCard icon={Target} label="Peso perdido" value={kg(lost)} detail={`${kg(remaining)} restantes`} tone="teal" />
        <MetricCard icon={Activity} label="Dias treinados" value={`${trainedDays}`} detail={`Maior sequência: ${maxStreak} dias`} tone="coral" />
        <MetricCard icon={CalendarDays} label="Sequência atual" value={`${streak} dias`} detail={`${daysTraining} dias desde o início`} />
        <MetricCard icon={Flame} label="Cardio da semana" value={minutes(cardioWeek)} detail="Meta: 3 sessões" tone="teal" />
        <MetricCard icon={Droplets} label="Consumo de água" value={liters(today.waterLiters)} detail={`Meta ${liters(data.profile.waterGoal)}`} />
        <MetricCard icon={Moon} label="Sono" value={`${today.sleepHours}h`} detail={`Meta ${data.profile.sleepGoal}h`} tone="coral" />
        <MetricCard icon={Timer} label="Tempo treinando" value={minutes(trainingWeek)} detail="Acumulado semanal" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <CoachCard report={coachReport} />
        <TodayWorkoutCard workout={todayWorkout} onDone={markTodayTrained} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Calendário GitHub</CardTitle>
            <p className="text-sm text-muted-foreground">Treino, cardio, descanso, viagem e doença por dia</p>
          </CardHeader>
          <CardContent>
            <FitnessHeatmap entries={data.entries} onSelect={setSelectedDay} />
          </CardContent>
        </Card>
        <WeeklySummary entries={data.entries} goals={data.goals} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Evolução de peso</CardTitle>
            <p className="text-sm text-muted-foreground">Gráfico com tendência dos últimos 30 dias</p>
          </CardHeader>
          <CardContent>
            <WeightTrendChart entries={data.entries} />
          </CardContent>
        </Card>
        <NutritionWidget nutrition={data.nutrition} proteinGoal={data.profile.proteinGoal} water={today.waterLiters} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Volume semanal e cardio</CardTitle>
          <p className="text-sm text-muted-foreground">Carga total levantada e minutos de cardio</p>
        </CardHeader>
        <CardContent>
          <VolumeChart entries={data.entries} />
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedDay)} title={selectedDay?.date ?? "Dia"} onClose={() => setSelectedDay(undefined)}>
        {selectedDay && (
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Peso", kg(selectedDay.weight)],
              ["Treino", minutes(selectedDay.workoutMinutes)],
              ["Cardio", minutes(selectedDay.cardioMinutes)],
              ["Água", liters(selectedDay.waterLiters)],
              ["Sono", `${selectedDay.sleepHours}h`],
              ["Humor", `${selectedDay.mood}/5`],
              ["Energia", `${selectedDay.energy}/5`],
              ["Carga total", `${selectedDay.totalLoad.toLocaleString("pt-BR")}kg`],
              ["Vitaminas", selectedDay.vitamins ? "Tomadas" : "Pendente"],
              ["Observações", selectedDay.notes]
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
