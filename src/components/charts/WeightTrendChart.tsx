import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DailyEntry } from "@/types/fitness";
import { theme } from "@/theme/theme";

interface WeightTrendChartProps {
  entries: DailyEntry[];
}

export function WeightTrendChart({ entries }: WeightTrendChartProps) {
  const data = entries.slice(-30).map((entry) => ({
    date: entry.date.slice(5),
    peso: entry.weight
  }));

  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="weight" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor={theme.chart.teal} stopOpacity={0.75} />
              <stop offset="95%" stopColor={theme.chart.teal} stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.18)" />
          <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} tickLine={false} />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} tickLine={false} domain={["dataMin - 1", "dataMax + 1"]} />
          <Tooltip contentStyle={{ background: "#091316", border: "1px solid #233338", borderRadius: 8 }} />
          <Area type="monotone" dataKey="peso" stroke={theme.chart.teal} fill="url(#weight)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
