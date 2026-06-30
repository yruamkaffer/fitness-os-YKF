import { weeklyWorkoutPlan } from "@/constants/workouts";
import { supabase } from "@/services/supabase";
import type { DailyEntry, DailyEntryInput, ExerciseLog, FitnessOverview, FitnessProfile } from "@/types/fitness";

const STORAGE_KEY = "fitness-os:v3";
const PROFILE_ID = "default";

const emptyProfile: FitnessProfile = {
  name: "Você",
  startWeight: null,
  currentWeight: null,
  goalWeight: null,
  startedAt: null
};

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function emptyOverview(): FitnessOverview {
  return {
    profile: emptyProfile,
    entries: [],
    workoutPlan: weeklyWorkoutPlan
  };
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
  const workoutDone =
    exerciseLogs.length > 0 ||
    input.status === "workout" ||
    input.status === "both" ||
    existing?.status === "workout" ||
    existing?.status === "both";
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

  if (latestWeight !== null) profile.currentWeight = latestWeight;

  return {
    profile,
    entries,
    workoutPlan: weeklyWorkoutPlan
  };
}

function loadLocalOverview(): FitnessOverview {
  if (typeof window === "undefined") return emptyOverview();
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return emptyOverview();

  try {
    const parsed = JSON.parse(stored) as Pick<FitnessOverview, "profile" | "entries">;
    return enrich({
      profile: { ...emptyProfile, ...parsed.profile },
      entries: Array.isArray(parsed.entries) ? parsed.entries : []
    });
  } catch {
    return emptyOverview();
  }
}

function saveLocalOverview(overview: FitnessOverview) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      profile: overview.profile,
      entries: overview.entries
    })
  );
}

function applyProfilePatch(overview: FitnessOverview, patch: Partial<FitnessProfile>) {
  return enrich({
    profile: { ...overview.profile, ...patch },
    entries: overview.entries
  });
}

function applyEntryPatch(overview: FitnessOverview, input: DailyEntryInput) {
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

async function ensureSupabaseProfile() {
  if (!supabase) return emptyProfile;

  const { data } = await supabase.from("profiles").select("*").eq("id", PROFILE_ID).maybeSingle();
  if (data) {
    return {
      name: data.name ?? "Você",
      startWeight: data.start_weight ?? null,
      currentWeight: data.current_weight ?? null,
      goalWeight: data.goal_weight ?? null,
      startedAt: data.started_at ?? null
    } satisfies FitnessProfile;
  }

  await supabase.from("profiles").insert({ id: PROFILE_ID, name: "Você" });
  return emptyProfile;
}

async function loadSupabaseOverview() {
  if (!supabase) return null;

  const profile = await ensureSupabaseProfile();
  const [{ data: entryRows, error: entryError }, { data: logRows, error: logError }] = await Promise.all([
    supabase.from("daily_entries").select("*").eq("profile_id", PROFILE_ID).order("date"),
    supabase.from("exercise_logs").select("*").eq("profile_id", PROFILE_ID).order("created_at")
  ]);

  if (entryError) throw entryError;
  if (logError) throw logError;

  const logsByDate = new Map<string, ExerciseLog[]>();
  (logRows ?? []).forEach((row) => {
    const logs = logsByDate.get(row.entry_date) ?? [];
    logs.push({
      exerciseId: row.exercise_id,
      name: row.name,
      sets: row.sets,
      reps: row.reps,
      load: row.load ?? null
    });
    logsByDate.set(row.entry_date, logs);
  });

  const entries: DailyEntry[] = (entryRows ?? []).map((row) => ({
    date: row.date,
    status: row.status,
    weight: row.weight ?? null,
    workoutMinutes: row.workout_minutes ?? null,
    cardioMinutes: row.cardio_minutes ?? null,
    totalLoad: row.total_load ?? 0,
    notes: row.notes ?? "",
    exerciseLogs: logsByDate.get(row.date) ?? []
  }));

  return enrich({ profile, entries });
}

async function saveSupabaseProfile(overview: FitnessOverview, patch: Partial<FitnessProfile>) {
  if (!supabase) return null;
  const next = applyProfilePatch(overview, patch);

  const { error } = await supabase.from("profiles").upsert({
    id: PROFILE_ID,
    name: next.profile.name,
    start_weight: next.profile.startWeight,
    current_weight: next.profile.currentWeight,
    goal_weight: next.profile.goalWeight,
    started_at: next.profile.startedAt
  });

  if (error) throw error;
  return loadSupabaseOverview();
}

async function saveSupabaseEntry(overview: FitnessOverview, input: DailyEntryInput) {
  if (!supabase) return null;
  const next = applyEntryPatch(overview, input);
  const entry = next.entries.find((item) => item.date === input.date);
  if (!entry) return next;

  const profilePayload = {
    id: PROFILE_ID,
    name: next.profile.name,
    start_weight: next.profile.startWeight,
    current_weight: next.profile.currentWeight,
    goal_weight: next.profile.goalWeight,
    started_at: next.profile.startedAt
  };

  const { error: profileError } = await supabase.from("profiles").upsert(profilePayload);
  if (profileError) throw profileError;

  const { error: entryError } = await supabase.from("daily_entries").upsert({
    profile_id: PROFILE_ID,
    date: entry.date,
    status: entry.status,
    weight: entry.weight,
    workout_minutes: entry.workoutMinutes,
    cardio_minutes: entry.cardioMinutes,
    total_load: entry.totalLoad,
    notes: entry.notes
  });
  if (entryError) throw entryError;

  const { error: deleteError } = await supabase.from("exercise_logs").delete().eq("profile_id", PROFILE_ID).eq("entry_date", entry.date);
  if (deleteError) throw deleteError;

  if (entry.exerciseLogs.length > 0) {
    const { error: logsError } = await supabase.from("exercise_logs").insert(
      entry.exerciseLogs.map((log) => ({
        profile_id: PROFILE_ID,
        entry_date: entry.date,
        exercise_id: log.exerciseId,
        name: log.name,
        sets: log.sets,
        reps: log.reps,
        load: log.load
      }))
    );
    if (logsError) throw logsError;
  }

  return loadSupabaseOverview();
}

export async function loadFitnessOverview(): Promise<FitnessOverview> {
  if (supabase) {
    try {
      const overview = await loadSupabaseOverview();
      if (overview) return overview;
    } catch (error) {
      console.error("Supabase load failed. Using local fallback.", error);
    }
  }

  return loadLocalOverview();
}

export async function updateProfile(overview: FitnessOverview, patch: Partial<FitnessProfile>) {
  if (supabase) {
    const next = await saveSupabaseProfile(overview, patch);
    if (next) return next;
  }

  const next = applyProfilePatch(overview, patch);
  saveLocalOverview(next);
  return next;
}

export async function upsertEntry(overview: FitnessOverview, input: DailyEntryInput) {
  if (supabase) {
    const next = await saveSupabaseEntry(overview, input);
    if (next) return next;
  }

  const next = applyEntryPatch(overview, input);
  saveLocalOverview(next);
  return next;
}

export async function markTodayWorkout(overview: FitnessOverview) {
  return upsertEntry(overview, {
    date: todayISO(),
    status: "workout"
  });
}
