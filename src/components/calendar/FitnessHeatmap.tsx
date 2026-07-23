import { eachDayOfInterval, format, parseISO, subDays } from "date-fns";
import { theme } from "@/theme/theme";
import type { DailyEntry } from "@/types/fitness";
import { cn } from "@/utils/cn";

interface FitnessHeatmapProps {
  entries: DailyEntry[];
  onSelect: (entry: DailyEntry) => void;
}

const labels = {
  none: "Sem registro",
  workout: "Treino",
  cardio: "Cardio",
  both: "Treino + Cardio"
} satisfies Partial<Record<DailyEntry["status"], string>>;

function statusLabel(status: DailyEntry["status"]) {
  if (status in labels) return labels[status as keyof typeof labels];
  return "Sem atividade";
}

function emptyEntry(date: string): DailyEntry {
  return {
    date,
    status: "none",
    weight: null,
    workoutMinutes: null,
    cardioMinutes: null,
    totalLoad: 0,
    exerciseLogs: [],
    notes: ""
  };
}

export function FitnessHeatmap({ entries, onSelect }: FitnessHeatmapProps) {
  const byDate = new Map(entries.map((entry) => [entry.date, entry]));
  const days = eachDayOfInterval({
    start: subDays(new Date(), 89),
    end: new Date()
  }).map((day) => {
    const date = format(day, "yyyy-MM-dd");
    return byDate.get(date) ?? emptyEntry(date);
  });

  return (
    <div className="min-w-0 space-y-4">
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>Trilha dos últimos 90 dias</span>
        <span>{days.filter((entry) => entry.status !== "none" && entry.status !== "rest").length}/90 ativos</span>
      </div>
      <div className="max-w-full overflow-hidden pb-1">
        <div className="grid grid-cols-[repeat(15,minmax(0,0.75rem))] gap-1 sm:grid-cols-[repeat(18,0.875rem)] lg:grid-cols-[repeat(30,0.875rem)]">
          {days.map((entry) => (
            <button
              key={entry.date}
              type="button"
              aria-label={`${format(parseISO(entry.date), "dd/MM/yyyy")} - ${statusLabel(entry.status)}`}
              title={`${format(parseISO(entry.date), "dd/MM/yyyy")} - ${statusLabel(entry.status)}`}
              onClick={() => onSelect(entry)}
              className={cn("aspect-square w-full rounded-[3px] ring-1 ring-white/5 transition duration-200 hover:z-10 hover:scale-125 hover:ring-secondary/70 focus-visible:z-10 focus-visible:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary", theme.heatmap[entry.status])}
            />
          ))}
        </div>
      </div>
      <div className="flex max-w-full flex-wrap gap-2 text-[11px] text-muted-foreground sm:text-xs">
        {Object.entries(labels).map(([key, label]) => (
          <span key={key} className="inline-flex items-center gap-2">
            <span className={cn("h-3 w-3 rounded-[3px]", theme.heatmap[key as DailyEntry["status"]])} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
