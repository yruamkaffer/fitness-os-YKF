import { addDays, differenceInCalendarDays, parseISO } from "date-fns";
import { Scale, TrendingDown, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeightTrendChart } from "@/components/charts/WeightTrendChart";
import { useFitnessOverview } from "@/hooks/useFitnessOverview";
import { kg } from "@/utils/format";

export function WeightPage() {
  const { data } = useFitnessOverview();
  if (!data) return null;

  const entries = data.entries;
  const first = entries[0];
  const last = entries[entries.length - 1];
  const totalLoss = first.weight - last.weight;
  const weeklyLoss = totalLoss / (entries.length / 7);
  const remaining = last.weight - data.profile.goalWeight;
  const weeksToGoal = Math.max(1, remaining / weeklyLoss);
  const projectedDate = addDays(parseISO(last.date), Math.round(weeksToGoal * 7));
  const days = differenceInCalendarDays(parseISO(last.date), parseISO(first.date));
  const metrics: Array<{ label: string; value: string; icon: LucideIcon }> = [
    { label: "Atual", value: kg(last.weight), icon: Scale },
    { label: "Perda total", value: kg(totalLoss), icon: TrendingDown },
    { label: "Média semanal", value: kg(weeklyLoss), icon: TrendingDown },
    { label: "Projeção", value: projectedDate.toLocaleDateString("pt-BR"), icon: Scale }
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Peso</p>
        <h1 className="text-3xl font-black tracking-normal">Registro e projeção</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-2 text-xl font-black tracking-normal">{value}</p>
              </div>
              <Icon className="h-5 w-5 text-primary" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{days} dias de histórico</CardTitle>
        </CardHeader>
        <CardContent>
          <WeightTrendChart entries={entries} />
        </CardContent>
      </Card>
    </div>
  );
}
