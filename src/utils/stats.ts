import type { DailyEntry } from "@/types/fitness";

function toTime(date: string) {
  return new Date(`${date}T12:00:00`).getTime();
}

function dayDiff(previous: string, next: string) {
  return Math.round((toTime(next) - toTime(previous)) / 86400000);
}

export function isActiveDay(entry: DailyEntry) {
  return entry.status === "workout" || entry.status === "cardio" || entry.status === "both";
}

export function isWorkoutDay(entry: DailyEntry) {
  return entry.status === "workout" || entry.status === "both";
}

export function isCardioDay(entry: DailyEntry) {
  return entry.status === "cardio" || entry.status === "both";
}

export function computeCurrentStreak(entries: DailyEntry[]) {
  const activeDates = [...new Set(entries.filter(isActiveDay).map((entry) => entry.date))].sort();
  if (activeDates.length === 0) return 0;

  let streak = 1;
  for (let index = activeDates.length - 1; index > 0; index -= 1) {
    if (dayDiff(activeDates[index - 1], activeDates[index]) === 1) streak += 1;
    else break;
  }
  return streak;
}

export function computeBestStreak(entries: DailyEntry[]) {
  const activeDates = [...new Set(entries.filter(isActiveDay).map((entry) => entry.date))].sort();
  if (activeDates.length === 0) return 0;

  let best = 1;
  let current = 1;
  for (let index = 1; index < activeDates.length; index += 1) {
    if (dayDiff(activeDates[index - 1], activeDates[index]) === 1) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }
  return best;
}
