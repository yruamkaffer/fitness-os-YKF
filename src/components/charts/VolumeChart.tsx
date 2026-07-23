import type { DailyEntry } from "@/types/fitness";
import { Progress } from "@/components/ui/progress";
import { minutes } from "@/utils/format";

interface VolumeChartProps {
  entries: DailyEntry[];
}

export function VolumeChart({ entries }: VolumeChartProps) {
  const data = entries
    .slice(-7)
    .map((entry) => ({
      date: entry.date,
      label: new Date(`${entry.date}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      volume: Math.round(entry.totalLoad),
      cardio: entry.cardioMinutes ?? 0
    }))
    .filter((entry) => entry.volume > 0 || entry.cardio > 0);

  if (data.length === 0) {
    return (
      <div className="flex min-h-60 w-full items-center justify-center rounded-md border bg-muted/20 px-6 text-center text-sm text-muted-foreground">
        Registre treino com carga ou cardio para acompanhar sua semana ativa.
      </div>
    );
  }

  const maxVolume = Math.max(...data.map((entry) => entry.volume), 1);
  const maxCardio = Math.max(...data.map((entry) => entry.cardio), 1);
  const totalVolume = data.reduce((sum, entry) => sum + entry.volume, 0);
  const totalCardio = data.reduce((sum, entry) => sum + entry.cardio, 0);
  const bestVolumeDay = data.reduce((best, entry) => (entry.volume > best.volume ? entry : best), data[0]);

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">Como ler:</span> volume é séries × repetições × carga dos exercícios. Cardio fica em minutos, separado, para não misturar kg com tempo no mesmo eixo.
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Volume total", `${totalVolume.toLocaleString("pt-BR")}kg`],
          ["Cardio total", minutes(totalCardio)],
          ["Dia mais pesado", bestVolumeDay.volume > 0 ? `${bestVolumeDay.label} · ${bestVolumeDay.volume.toLocaleString("pt-BR")}kg` : "--"]
        ].map(([label, value]) => (
          <div key={label} className="rounded-md border bg-background/70 p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-base font-black tracking-normal">{value}</p>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {data.map((entry) => (
          <div key={entry.date} className="rounded-md border bg-muted/20 p-3">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-semibold">{entry.label}</span>
              <span className="text-xs text-muted-foreground">
                {entry.volume > 0 ? `${entry.volume.toLocaleString("pt-BR")}kg` : "sem carga"} · {entry.cardio > 0 ? minutes(entry.cardio) : "sem cardio"}
              </span>
            </div>
            <div className="mt-3 grid gap-2">
              <div className="grid grid-cols-[4.5rem_1fr] items-center gap-2 text-xs text-muted-foreground">
                <span>Carga</span>
                <Progress value={(entry.volume / maxVolume) * 100} />
              </div>
              <div className="grid grid-cols-[4.5rem_1fr] items-center gap-2 text-xs text-muted-foreground">
                <span>Cardio</span>
                <Progress value={(entry.cardio / maxCardio) * 100} className="[&>div]:bg-secondary [&>div]:shadow-[0_0_12px_hsl(var(--secondary)/0.45)]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
