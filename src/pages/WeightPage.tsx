import { addDays, differenceInCalendarDays, parseISO } from "date-fns";
import { Scale, TrendingDown, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoadingState } from "@/components/ui/loading-state";
import { WeightTrendChart } from "@/components/charts/WeightTrendChart";
import { useFitnessOverview } from "@/hooks/useFitnessOverview";
import { kg, optionalKg } from "@/utils/format";

export function WeightPage() {
  const { data, isLoading } = useFitnessOverview();
  if (isLoading) return <PageLoadingState />;

  const weightEntries = data.entries.filter((entry) => entry.weight !== null);
  const first = weightEntries[0];
  const last = weightEntries[weightEntries.length - 1];
  const totalLoss = first && last && first.weight !== null && last.weight !== null ? first.weight - last.weight : null;
  const days = first && last ? Math.max(1, differenceInCalendarDays(parseISO(last.date), parseISO(first.date))) : 0;
  const weeklyLoss = totalLoss !== null && days > 0 ? totalLoss / (days / 7) : null;
  const remaining = last?.weight !== null && last?.weight !== undefined && data.profile.goalWeight !== null ? Math.abs(last.weight - data.profile.goalWeight) : null;
  const projectedDate =
    weeklyLoss && weeklyLoss > 0 && remaining !== null && last
      ? addDays(parseISO(last.date), Math.round((remaining / weeklyLoss) * 7)).toLocaleDateString("pt-BR")
      : "--";
  const metrics: Array<{ label: string; value: string; icon: LucideIcon }> = [
    { label: "Atual", value: optionalKg(data.profile.currentWeight), icon: Scale },
    { label: "Perda total", value: totalLoss !== null ? kg(Math.max(0, totalLoss)) : "--", icon: TrendingDown },
    { label: "Média semanal", value: weeklyLoss !== null ? kg(Math.max(0, weeklyLoss)) : "--", icon: TrendingDown },
    { label: "Projeção", value: projectedDate, icon: Scale }
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
          <CardTitle>{weightEntries.length} registro(s) de peso</CardTitle>
        </CardHeader>
        <CardContent>
          <WeightTrendChart entries={data.entries} />
        </CardContent>
      </Card>
    </div>
  );
}
