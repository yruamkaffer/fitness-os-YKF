import type { Achievement, DailyEntry, FitnessProfile, Goal } from "@/types/fitness";

export const emptyProfile: FitnessProfile = {
  name: "Você",
  startWeight: null,
  currentWeight: null,
  goalWeight: null,
  startedAt: null,
  weeklyWorkoutGoal: 5,
  weeklyCardioGoal: 3
};

export const dailyEntries: DailyEntry[] = [];

export const goals: Goal[] = [];

export const achievements: Achievement[] = [
  {
    id: "first-workout",
    label: "Primeiro treino",
    description: "Registre seu primeiro treino para desbloquear.",
    unlocked: false,
    progress: 0
  },
  {
    id: "seven-days",
    label: "7 dias seguidos",
    description: "Complete uma sequência de 7 dias com treino ou cardio.",
    unlocked: false,
    progress: 0
  },
  {
    id: "hundred-workouts",
    label: "100 treinos",
    description: "Construa um histórico consistente de treinos.",
    unlocked: false,
    progress: 0
  },
  {
    id: "goal",
    label: "Meta alcançada",
    description: "Chegue ao peso configurado como meta.",
    unlocked: false,
    progress: 0
  }
];
