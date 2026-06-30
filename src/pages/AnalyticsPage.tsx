import { Radar, RadarChart, PolarAngleAxis, PolarGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VolumeChart } from "@/components/charts/VolumeChart";
import { useFitnessOverview } from "@/hooks/useFitnessOverview";
import { theme } from "@/theme/theme";

export function AnalyticsPage() {
  const { data } = useFitnessOverview();
  if (!data) return null;

  const radar = [
    { metric: "Sono", value: 76 },
    { metric: "Água", value: 88 },
    { metric: "Cardio", value: 68 },
    { metric: "Proteína", value: 92 },
    { metric: "Treinos", value: 84 },
    { metric: "Mobilidade", value: 57 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Analytics</p>
        <h1 className="text-3xl font-black tracking-normal">Insights estilo GitHub</h1>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Radar de hábitos</CardTitle>
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
      <div className="grid gap-4 md:grid-cols-4">
        {["Sono x Peso", "Água x Peso", "Cardio x Peso", "Proteína x Massa Magra"].map((item) => (
          <Card key={item}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Correlação</p>
              <p className="mt-2 font-semibold">{item}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
