import { subDays, formatISO } from "date-fns";
import type { Achievement, DailyEntry, FitnessProfile, Goal, NutritionDay } from "@/types/fitness";

const today = new Date(2026, 5, 30);

function iso(daysAgo: number) {
  return formatISO(subDays(today, daysAgo), { representation: "date" });
}

const statuses: DailyEntry["status"][] = ["workout", "cardio", "both", "rest", "workout", "workout", "cardio"];

export const profile: FitnessProfile = {
  name: "Atleta",
  startWeight: 90,
  currentWeight: 82.4,
  goalWeight: 76,
  startedAt: "2026-03-01",
  weeklyWorkoutGoal: 5,
  weeklyCardioGoal: 3,
  waterGoal: 3.2,
  sleepGoal: 7.5,
  proteinGoal: 170
};

export const dailyEntries: DailyEntry[] = Array.from({ length: 140 }, (_, index) => {
  const daysAgo = 139 - index;
  const status = statuses[index % statuses.length];
  const workoutMinutes = status === "workout" || status === "both" ? 54 + (index % 5) * 7 : 0;
  const cardioMinutes = status === "cardio" || status === "both" ? 25 + (index % 4) * 5 : 0;
  const weightTrend = 90 - index * 0.055 + Math.sin(index / 5) * 0.35;

  return {
    date: iso(daysAgo),
    status,
    weight: Number(weightTrend.toFixed(1)),
    waterLiters: Number((2.2 + (index % 5) * 0.22).toFixed(1)),
    sleepHours: Number((6.3 + (index % 6) * 0.18).toFixed(1)),
    mood: 3 + (index % 3),
    energy: 3 + ((index + 1) % 3),
    workoutMinutes,
    cardioMinutes,
    cardioCalories: cardioMinutes * 9,
    totalLoad: workoutMinutes ? 12500 + (index % 8) * 940 : 0,
    notes: status === "rest" ? "Recuperação ativa e mobilidade leve." : "Sessão concluída com boa execução.",
    vitamins: index % 9 !== 0
  };
});

export const todayNutrition: NutritionDay = {
  calories: 2160,
  protein: 156,
  carbs: 204,
  fats: 62,
  waterGoal: profile.waterGoal,
  supplements: [
    { name: "Creatina", taken: true },
    { name: "Whey", taken: true },
    { name: "Vitamina D", taken: true },
    { name: "Vitamina B12", taken: true },
    { name: "Multivitamínico", taken: false },
    { name: "Ômega 3", taken: true },
    { name: "Magnésio", taken: false }
  ]
};

export const goals: Goal[] = [
  { id: "weight", label: "Peso", current: profile.currentWeight, target: profile.goalWeight, unit: "kg" },
  { id: "workouts", label: "Treinos semanais", current: 4, target: profile.weeklyWorkoutGoal, unit: "treinos" },
  { id: "cardio", label: "Cardio semanal", current: 2, target: profile.weeklyCardioGoal, unit: "sessões" },
  { id: "water", label: "Água", current: 2.8, target: profile.waterGoal, unit: "L" },
  { id: "sleep", label: "Sono", current: 7.2, target: profile.sleepGoal, unit: "h" },
  { id: "protein", label: "Proteína", current: todayNutrition.protein, target: profile.proteinGoal, unit: "g" }
];

export const achievements: Achievement[] = [
  { id: "first-workout", label: "Primeiro treino", description: "O começo oficial do projeto.", unlocked: true, progress: 100 },
  { id: "seven-days", label: "7 dias seguidos", description: "Sequência inicial consolidada.", unlocked: true, progress: 100 },
  { id: "thirty-days", label: "30 dias", description: "Consistência acima da média.", unlocked: false, progress: 63 },
  { id: "hundred-workouts", label: "100 treinos", description: "Volume de atleta.", unlocked: false, progress: 42 },
  { id: "bench-100", label: "100kg Supino", description: "Marco de força no supino.", unlocked: false, progress: 90 },
  { id: "deadlift-200", label: "200kg Terra", description: "Força máxima em construção.", unlocked: false, progress: 56 },
  { id: "under-80", label: "Peso abaixo de 80kg", description: "Próximo grande corte.", unlocked: false, progress: 73 },
  { id: "goal", label: "Meta alcançada", description: "Objetivo final de peso.", unlocked: false, progress: 54 }
];
