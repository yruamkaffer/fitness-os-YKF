import type { DailyEntry, ExerciseLog } from "@/types/fitness";

export interface ExerciseHistory {
  previous?: ExerciseLog;
  pr?: ExerciseLog;
}

const exerciseAliases: Record<string, string[]> = {
  "supino-inclinado": ["supino-inclinado-quinta"],
  "remada-curvada": ["remada-curvada-quinta"],
  "desenvolvimento-militar": ["desenvolvimento-quinta", "desenvolvimento"],
  "remada-unilateral": ["remada-unilateral-halter", "remada-unilateral-quinta", "remada unilateral com halter"],
  "encolhimento": ["encolhimento-trapezio", "encolhimento para trapezio"],
  "rosca-direta": ["rosca-direta-quinta"],
  "triceps-testa": ["triceps-testa-quinta"],
  agachamento: ["agachamento livre"],
  "terra-romeno": ["terra-romeno-sexta"],
  afundo: ["afundo-sexta", "afundo com halteres"],
  panturrilha: ["panturrilha-sexta", "panturrilha em pe"],
  "hip-thrust": ["hip thrust com barra"],
  stiff: ["stiff com barra", "stiff com halteres", "stiff com barra ou halteres"],
  "abdominal-reverso": ["abdominal-infra", "abdominal infra"]
};

function normalizeExercise(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function sameExercise(log: ExerciseLog, exerciseId: string, name: string) {
  const candidates = new Set(
    [exerciseId, name, ...(exerciseAliases[exerciseId] ?? [])].map(normalizeExercise)
  );

  return candidates.has(normalizeExercise(log.exerciseId)) || candidates.has(normalizeExercise(log.name));
}

export function getExerciseHistory(entries: DailyEntry[], exerciseId: string, name: string, beforeDate?: string): ExerciseHistory {
  const matches = entries
    .filter((entry) => !beforeDate || entry.date < beforeDate)
    .sort((a, b) => a.date.localeCompare(b.date))
    .flatMap((entry) => entry.exerciseLogs.filter((log) => sameExercise(log, exerciseId, name)).map((log) => ({ ...log, entryDate: entry.date })));

  const loaded = matches.filter((log) => (log.load ?? 0) > 0);
  const previous = loaded[loaded.length - 1];
  const pr = loaded.reduce<(ExerciseLog & { entryDate: string }) | undefined>((best, log) => {
    if (!best) return log;
    return (log.load ?? 0) > (best.load ?? 0) ? log : best;
  }, undefined);

  return { previous, pr };
}

export function formatExerciseHistory(history: ExerciseHistory) {
  const previous = history.previous?.load ? `Ultima: ${history.previous.load}kg` : "Ultima: --";
  const pr = history.pr?.load ? `PR: ${history.pr.load}kg` : "PR: --";
  return `${previous} · ${pr}`;
}
