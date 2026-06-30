import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DailyEntry } from "@/types/fitness";
import { theme } from "@/theme/theme";

interface VolumeChartProps {
  entries: DailyEntry[];
}

export function VolumeChart({ entries }: VolumeChartProps) {
  const data = entries.slice(-7).map((entry) => ({
    date: entry.date.slice(5),
    volume: Math.round(entry.totalLoad / 1000),
    cardio: entry.cardioMinutes ?? 0
  }));

  if (data.length === 0) {
    return (
      <div className="flex h-52 w-full items-center justify-center rounded-md border bg-muted/20 px-6 text-center text-sm text-muted-foreground">
        Registre treino, carga ou cardio para ver o volume semanal.
      </div>
    );
  }

  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.18)" />
          <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} tickLine={false} />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} tickLine={false} />
          <Tooltip contentStyle={{ background: "#091316", border: "1px solid #233338", borderRadius: 8 }} />
          <Bar dataKey="volume" fill={theme.chart.primary} radius={[6, 6, 0, 0]} />
          <Bar dataKey="cardio" fill={theme.chart.coral} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
