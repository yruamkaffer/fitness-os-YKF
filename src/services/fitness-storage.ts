import { achievements as baseAchievements, dailyEntries, emptyProfile } from "@/database/seed";
import { weeklyWorkoutPlan } from "@/constants/workouts";
import type { Achievement, DailyEntry, DailyEntryInput, FitnessOverview, FitnessProfile, Goal } from "@/types/fitness";
import { computeCurrentStreak, isCardioDay, isWorkoutDay } from "@/utils/stats";

const STORAGE_KEY = "fitness-os:v1";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeEntry(input: DailyEntryInput, existing?: DailyEntry): DailyEntry {
  const workoutMinutes = input.workoutMinutes ?? existing?.workoutMinutes ?? 0;
  const cardioMinutes = input.cardioMinutes ?? existing?.cardioMinutes ?? 0;
  const status = input.status ?? existing?.status ?? getStatus(workoutMinutes, cardioMinutes);

  return {
    date: input.date,
    status,
    weight: input.weight ?? existing?.weight ?? null,
    mood: input.mood ?? existing?.mood ?? null,
    energy: input.energy ?? existing?.energy ?? null,
    workoutMinutes,
    cardioMinutes,
    cardioCalories: input.cardioCalories ?? existing?.cardioCalories ?? 0,
    totalLoad: input.totalLoad ?? existing?.totalLoad ?? 0,
    notes: input.notes ?? existing?.notes ?? ""
  };
}

function getStatus(workoutMinutes: number, cardioMinutes: number): DailyEntry["status"] {
  if (workoutMinutes > 0 && cardioMinutes > 0) return "both";
  if (workoutMinutes > 0) return "workout";
  if (cardioMinutes > 0) return "cardio";
  return "none";
}

function computeGoals(profile: FitnessProfile, entries: DailyEntry[]): Goal[] {
  const week = entries.slice(-7);
  const workouts = week.filter(isWorkoutDay).length;
  const cardios = week.filter(isCardioDay).length;
  const goals: Goal[] = [
    { id: "workouts", label: "Treinos semanais", current: workouts, target: profile.weeklyWorkoutGoal, unit: "treinos" },
    { id: "cardio", label: "Cardio semanal", current: cardios, target: profile.weeklyCardioGoal, unit: "sessões" }
  ];

  if (profile.currentWeight !== null && profile.goalWeight !== null) {
    goals.unshift({
      id: "weight",
      label: "Peso",
      current: profile.currentWeight,
      target: profile.goalWeight,
      unit: "kg"
    });
  }

  return goals;
}

function computeAchievements(profile: FitnessProfile, entries: DailyEntry[]): Achievement[] {
  const workoutCount = entries.filter(isWorkoutDay).length;
  const streak = computeCurrentStreak(entries);
  const reachedGoal =
    profile.currentWeight !== null &&
    profile.goalWeight !== null &&
    profile.startWeight !== null &&
    (profile.startWeight >= profile.goalWeight
      ? profile.currentWeight <= profile.goalWeight
      : profile.currentWeight >= profile.goalWeight);

  return baseAchievements.map((achievement) => {
    if (achievement.id === "first-workout") {
      return { ...achievement, unlocked: workoutCount > 0, progress: Math.min(100, workoutCount * 100) };
    }
    if (achievement.id === "seven-days") {
      return { ...achievement, unlocked: streak >= 7, progress: Math.min(100, (streak / 7) * 100) };
    }
    if (achievement.id === "hundred-workouts") {
      return { ...achievement, unlocked: workoutCount >= 100, progress: Math.min(100, workoutCount) };
    }
    if (achievement.id === "goal") {
      return { ...achievement, unlocked: reachedGoal, progress: reachedGoal ? 100 : 0 };
    }
    return achievement;
  });
}

function enrich(raw: Pick<FitnessOverview, "profile" | "entries">): FitnessOverview {
  const entries = [...raw.entries].sort((a, b) => a.date.localeCompare(b.date));
  const profile = { ...emptyProfile, ...raw.profile };
  const latestWeight = [...entries].reverse().find((entry) => entry.weight !== null)?.weight ?? null;

  if (latestWeight !== null) {
    profile.currentWeight = latestWeight;
  }

  return {
    profile,
    entries,
    goals: computeGoals(profile, entries),
    achievements: computeAchievements(profile, entries),
    workoutPlan: weeklyWorkoutPlan
  };
}

export function loadFitnessOverview(): FitnessOverview {
  if (typeof window === "undefined") {
    return enrich({ profile: emptyProfile, entries: dailyEntries });
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return enrich({ profile: emptyProfile, entries: dailyEntries });

  try {
    const parsed = JSON.parse(stored) as Pick<FitnessOverview, "profile" | "entries">;
    return enrich({
      profile: { ...emptyProfile, ...parsed.profile },
      entries: Array.isArray(parsed.entries) ? parsed.entries : []
    });
  } catch {
    return enrich({ profile: emptyProfile, entries: dailyEntries });
  }
}

export function saveFitnessOverview(overview: FitnessOverview) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      profile: overview.profile,
      entries: overview.entries
    })
  );
}

export function updateProfile(overview: FitnessOverview, patch: Partial<FitnessProfile>) {
  return enrich({
    profile: { ...overview.profile, ...patch },
    entries: overview.entries
  });
}

export function upsertEntry(overview: FitnessOverview, input: DailyEntryInput) {
  const existing = overview.entries.find((entry) => entry.date === input.date);
  const nextEntry = normalizeEntry(input, existing);
  const nextEntries = existing
    ? overview.entries.map((entry) => (entry.date === input.date ? nextEntry : entry))
    : [...overview.entries, nextEntry];

  return enrich({
    profile: {
      ...overview.profile,
      currentWeight: nextEntry.weight ?? overview.profile.currentWeight,
      startWeight: overview.profile.startWeight ?? nextEntry.weight ?? null,
      startedAt: overview.profile.startedAt ?? input.date
    },
    entries: nextEntries
  });
}

export function markTodayWorkout(overview: FitnessOverview) {
  return upsertEntry(overview, {
    date: todayISO(),
    status: "workout",
    workoutMinutes: 0,
    notes: "Treino registrado pelo botão Treinei hoje. Informe tempo e carga quando quiser detalhar."
  });
}

export { todayISO };
