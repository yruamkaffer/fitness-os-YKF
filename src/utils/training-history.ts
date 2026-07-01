import type { DailyEntry, ExerciseLog } from "@/types/fitness";

export interface ExerciseHistory {
  previous?: ExerciseLog;
  pr?: ExerciseLog;
}

function sameExercise(log: ExerciseLog, exerciseId: string, name: string) {
  return log.exerciseId === exerciseId || log.name.toLocaleLowerCase("pt-BR") === name.toLocaleLowerCase("pt-BR");
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
