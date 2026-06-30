import { eachDayOfInterval, format, parseISO, subDays } from "date-fns";
import { theme } from "@/theme/theme";
import type { DailyEntry } from "@/types/fitness";
import { cn } from "@/utils/cn";

interface FitnessHeatmapProps {
  entries: DailyEntry[];
  onSelect: (entry: DailyEntry) => void;
}

const labels: Record<DailyEntry["status"], string> = {
  none: "Sem registro",
  workout: "Treino",
  cardio: "Cardio",
  both: "Treino + Cardio",
  rest: "Descanso"
};

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
    start: subDays(new Date(), 364),
    end: new Date()
  }).map((day) => {
    const date = format(day, "yyyy-MM-dd");
    return byDate.get(date) ?? emptyEntry(date);
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-2">
        {days.map((entry) => (
          <button
            key={entry.date}
            type="button"
            aria-label={`${format(parseISO(entry.date), "dd/MM/yyyy")} - ${labels[entry.status]}`}
            title={`${format(parseISO(entry.date), "dd/MM/yyyy")} - ${labels[entry.status]}`}
            onClick={() => onSelect(entry)}
            className={cn("h-3 w-3 shrink-0 rounded-[3px] ring-1 ring-white/5 transition hover:scale-125", theme.heatmap[entry.status])}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
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
