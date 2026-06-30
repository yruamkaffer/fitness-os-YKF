export type DayStatus = "none" | "workout" | "cardio" | "both" | "rest" | "sick" | "travel";

export type MuscleGroup =
  | "Peito"
  | "Costas"
  | "Ombros"
  | "Bíceps"
  | "Tríceps"
  | "Pernas"
  | "Core"
  | "Cardio";

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  load: number;
  rpe: number;
  restSeconds: number;
  history: Array<{ date: string; load: number; reps: number }>;
  pr: number;
}

export interface WorkoutPlan {
  weekday: number;
  label: string;
  focus: string;
  groups: MuscleGroup[];
  exercises: Exercise[];
  estimatedMinutes: number;
}

export interface DailyEntry {
  date: string;
  status: DayStatus;
  weight: number;
  waterLiters: number;
  sleepHours: number;
  mood: number;
  energy: number;
  workoutMinutes: number;
  cardioMinutes: number;
  cardioCalories: number;
  totalLoad: number;
  notes: string;
  vitamins: boolean;
  photos?: {
    front?: string;
    side?: string;
    back?: string;
  };
}

export interface NutritionDay {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  waterGoal: number;
  supplements: Array<{ name: string; taken: boolean }>;
}

export interface Goal {
  id: string;
  label: string;
  current: number;
  target: number;
  unit: string;
}

export interface Achievement {
  id: string;
  label: string;
  description: string;
  unlocked: boolean;
  progress: number;
}

export interface FitnessProfile {
  name: string;
  startWeight: number;
  currentWeight: number;
  goalWeight: number;
  startedAt: string;
  weeklyWorkoutGoal: number;
  weeklyCardioGoal: number;
  waterGoal: number;
  sleepGoal: number;
  proteinGoal: number;
}
