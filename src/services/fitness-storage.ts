import { weeklyWorkoutPlan } from "@/constants/workouts";
import type { DailyEntry, DailyEntryInput, ExerciseLog, FitnessOverview, FitnessProfile } from "@/types/fitness";

const STORAGE_KEY = "fitness-os:v2";

const emptyProfile: FitnessProfile = {
  name: "Você",
  startWeight: null,
  currentWeight: null,
  goalWeight: null,
  startedAt: null
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function calculateStatus(workoutDone: boolean, cardioMinutes: number | null | undefined): DailyEntry["status"] {
  const hasCardio = (cardioMinutes ?? 0) > 0;
  if (workoutDone && hasCardio) return "both";
  if (workoutDone) return "workout";
  if (hasCardio) return "cardio";
  return "none";
}

function calculateTotalLoad(logs: ExerciseLog[]) {
  return logs.reduce((sum, log) => {
    const reps = Number.parseFloat(log.reps.replace(",", "."));
    const load = log.load ?? 0;
    if (!Number.isFinite(reps) || reps <= 0 || load <= 0 || log.sets <= 0) return sum;
    return sum + log.sets * reps * load;
  }, 0);
}

function normalizeEntry(input: DailyEntryInput, existing?: DailyEntry): DailyEntry {
  const exerciseLogs = input.exerciseLogs ?? existing?.exerciseLogs ?? [];
  const workoutDone = exerciseLogs.length > 0 || input.status === "workout" || input.status === "both" || existing?.status === "workout" || existing?.status === "both";
  const cardioMinutes = input.cardioMinutes ?? existing?.cardioMinutes ?? null;
  const status = input.status ?? calculateStatus(workoutDone, cardioMinutes);

  return {
    date: input.date,
    status,
    weight: input.weight ?? existing?.weight ?? null,
    workoutMinutes: input.workoutMinutes ?? existing?.workoutMinutes ?? null,
    cardioMinutes,
    totalLoad: input.totalLoad ?? calculateTotalLoad(exerciseLogs),
    exerciseLogs,
    notes: input.notes ?? existing?.notes ?? ""
  };
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
    workoutPlan: weeklyWorkoutPlan
  };
}

export function loadFitnessOverview(): FitnessOverview {
  if (typeof window === "undefined") {
    return enrich({ profile: emptyProfile, entries: [] });
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return enrich({ profile: emptyProfile, entries: [] });

  try {
    const parsed = JSON.parse(stored) as Pick<FitnessOverview, "profile" | "entries">;
    return enrich({
      profile: { ...emptyProfile, ...parsed.profile },
      entries: Array.isArray(parsed.entries) ? parsed.entries : []
    });
  } catch {
    return enrich({ profile: emptyProfile, entries: [] });
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
    status: "workout"
  });
}

export { todayISO };
