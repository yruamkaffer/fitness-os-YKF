export type DayStatus = "none" | "workout" | "cardio" | "both" | "rest";

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
  restSeconds: number;
}

export interface WorkoutPlan {
  weekday: number;
  label: string;
  focus: string;
  groups: MuscleGroup[];
  exercises: Exercise[];
}

export interface ExerciseLog {
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  load: number | null;
}

export interface DailyEntry {
  date: string;
  status: DayStatus;
  weight: number | null;
  workoutMinutes: number | null;
  cardioMinutes: number | null;
  totalLoad: number;
  exerciseLogs: ExerciseLog[];
  notes: string;
}

export interface FitnessProfile {
  name: string;
  startWeight: number | null;
  currentWeight: number | null;
  goalWeight: number | null;
  startedAt: string | null;
}

export interface FitnessOverview {
  profile: FitnessProfile;
  entries: DailyEntry[];
  workoutPlan: WorkoutPlan[];
}

export type DailyEntryInput = Partial<Omit<DailyEntry, "date">> & {
  date: string;
};
