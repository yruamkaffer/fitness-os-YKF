import { addDays, differenceInCalendarDays, parseISO } from "date-fns";
import { Goal, Scale, TrendingDown, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoadingState } from "@/components/ui/loading-state";
import { WeightTrendChart } from "@/components/charts/WeightTrendChart";
import { useFitnessOverview } from "@/hooks/useFitnessOverview";
import { kg, optionalKg } from "@/utils/format";

const TARGET_MIN_WEIGHT = 78;
const TARGET_MAX_WEIGHT = 80;
const TARGET_DATE = "2026-12-01";

export function WeightPage() {
  const { data, isLoading } = useFitnessOverview();
  if (isLoading) return <PageLoadingState />;

  const weightEntries = data.entries.filter((entry) => entry.weight !== null);
  const first = weightEntries[0];
  const last = weightEntries[weightEntries.length - 1];
  const totalLoss = first && last && first.weight !== null && last.weight !== null ? first.weight - last.weight : null;
  const days = first && last ? Math.max(1, differenceInCalendarDays(parseISO(last.date), parseISO(first.date))) : 0;
  const weeklyLoss = totalLoss !== null && days > 0 ? totalLoss / (days / 7) : null;
  const currentWeight = last?.weight ?? data.profile.currentWeight;
  const kilosTo78 = currentWeight !== null && currentWeight > TARGET_MIN_WEIGHT ? currentWeight - TARGET_MIN_WEIGHT : 0;
  const projected78Date =
    last && weeklyLoss !== null && weeklyLoss > 0 && kilosTo78 > 0
      ? addDays(parseISO(last.date), Math.round((kilosTo78 / weeklyLoss) * 7)).toLocaleDateString("pt-BR")
      : currentWeight !== null && currentWeight <= TARGET_MIN_WEIGHT
        ? "Já chegou"
        : "--";
  const daysUntilTarget = last ? Math.max(1, differenceInCalendarDays(parseISO(TARGET_DATE), parseISO(last.date))) : 0;
  const weeksUntilTarget = daysUntilTarget / 7;
  const kilosToTarget = currentWeight !== null && currentWeight > TARGET_MAX_WEIGHT ? currentWeight - TARGET_MAX_WEIGHT : 0;
  const weeklyTargetLoss = currentWeight !== null && weeksUntilTarget > 0 ? kilosToTarget / weeksUntilTarget : null;
  const targetStatus =
    currentWeight === null
      ? "Registre peso para calcular"
      : currentWeight < TARGET_MIN_WEIGHT
        ? "Subir com massa magra"
        : currentWeight <= TARGET_MAX_WEIGHT
          ? "Manter e recompor"
          : `${kg(weeklyTargetLoss ?? 0)}/sem até dez`;
  const targetDetail =
    currentWeight === null
      ? "A meta é chegar em dezembro entre 78 e 80kg, muscular e com baixa gordura."
      : currentWeight > TARGET_MAX_WEIGHT
        ? `Faltam ${kg(kilosToTarget)} até 80kg. Ritmo atual: ${weeklyLoss !== null ? `${kg(Math.max(0, weeklyLoss))}/sem` : "--"}.`
        : "Você já está dentro ou abaixo da faixa. O foco vira performance, medidas e gordura baixa.";
  const metrics: Array<{ label: string; value: string; icon: LucideIcon }> = [
    { label: "Atual", value: optionalKg(data.profile.currentWeight), icon: Scale },
    { label: "Perda total", value: totalLoss !== null ? kg(Math.max(0, totalLoss)) : "--", icon: TrendingDown },
    { label: "Média semanal", value: weeklyLoss !== null ? kg(Math.max(0, weeklyLoss)) : "--", icon: TrendingDown },
    { label: "78kg no ritmo atual", value: projected78Date, icon: Goal }
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
      <Card className="border-primary/35">
        <CardContent className="grid gap-3 p-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-semibold text-primary">Projeção corrigida</p>
            <h2 className="mt-1 text-2xl font-black tracking-normal">{targetStatus}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{targetDetail}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Mantendo a média registrada até agora, a estimativa para bater 78kg é <span className="font-semibold text-foreground">{projected78Date}</span>.
            </p>
          </div>
          <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
            Dezembro: <span className="font-semibold text-foreground">78-80kg</span>
            <br />
            Meta: muscular, seco e sustentável
          </div>
        </CardContent>
      </Card>
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
