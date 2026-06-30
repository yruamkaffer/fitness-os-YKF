import { Radar, RadarChart, PolarAngleAxis, PolarGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VolumeChart } from "@/components/charts/VolumeChart";
import { useFitnessOverview } from "@/hooks/useFitnessOverview";
import { theme } from "@/theme/theme";
import { isCardioDay, isWorkoutDay } from "@/utils/stats";

export function AnalyticsPage() {
  const { data } = useFitnessOverview();
  if (!data) return null;

  const week = data.entries.slice(-7);
  const workoutScore = Math.min(100, (week.filter(isWorkoutDay).length / data.profile.weeklyWorkoutGoal) * 100);
  const cardioScore = Math.min(100, (week.filter(isCardioDay).length / data.profile.weeklyCardioGoal) * 100);
  const volumeScore = Math.min(100, (week.reduce((sum, entry) => sum + entry.totalLoad, 0) / 50000) * 100);
  const weightScore = data.entries.filter((entry) => entry.weight !== null).length > 0 ? 100 : 0;
  const radar = [
    { metric: "Treinos", value: workoutScore },
    { metric: "Cardio", value: cardioScore },
    { metric: "Volume", value: volumeScore },
    { metric: "Peso", value: weightScore }
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Analytics</p>
        <h1 className="text-3xl font-black tracking-normal">Insights dos seus registros</h1>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Radar de consistência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radar}>
                  <PolarGrid stroke="rgba(148, 163, 184, 0.28)" />
                  <PolarAngleAxis dataKey="metric" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "#091316", border: "1px solid #233338", borderRadius: 8 }} />
                  <Radar dataKey="value" stroke={theme.chart.primary} fill={theme.chart.primary} fillOpacity={0.35} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Volume semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <VolumeChart entries={data.entries} />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {["Cardio x Peso", "Volume x Peso", "Treinos x Evolução"].map((item) => (
          <Card key={item}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Correlação futura</p>
              <p className="mt-2 font-semibold">{item}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
