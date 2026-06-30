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
  weight: number | null;
  mood: number | null;
  energy: number | null;
  workoutMinutes: number;
  cardioMinutes: number;
  cardioCalories: number;
  totalLoad: number;
  notes: string;
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
  startWeight: number | null;
  currentWeight: number | null;
  goalWeight: number | null;
  startedAt: string | null;
  weeklyWorkoutGoal: number;
  weeklyCardioGoal: number;
}

export interface FitnessOverview {
  profile: FitnessProfile;
  entries: DailyEntry[];
  goals: Goal[];
  achievements: Achievement[];
  workoutPlan: WorkoutPlan[];
}

export type DailyEntryInput = Partial<Omit<DailyEntry, "date">> & {
  date: string;
};
