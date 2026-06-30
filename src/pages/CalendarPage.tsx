import { Dialog } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FitnessHeatmap } from "@/components/calendar/FitnessHeatmap";
import { useFitnessOverview } from "@/hooks/useFitnessOverview";
import { useFitnessStore } from "@/stores/fitness-store";
import { minutes, optionalKg } from "@/utils/format";

export function CalendarPage() {
  const { data } = useFitnessOverview();
  const selectedDay = useFitnessStore((state) => state.selectedDay);
  const setSelectedDay = useFitnessStore((state) => state.setSelectedDay);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Calendário</p>
        <h1 className="text-3xl font-black tracking-normal">Histórico de treinos</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Calendário estilo GitHub</CardTitle>
          <p className="text-sm text-muted-foreground">Os quadrados só ganham cor quando você salva treino, cardio ou descanso.</p>
        </CardHeader>
        <CardContent>
          <FitnessHeatmap entries={data.entries} onSelect={setSelectedDay} />
        </CardContent>
      </Card>
      <Dialog open={Boolean(selectedDay)} title={selectedDay?.date ?? "Dia"} onClose={() => setSelectedDay(undefined)}>
        {selectedDay && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Peso", optionalKg(selectedDay.weight)],
                ["Treino", selectedDay.status === "workout" || selectedDay.status === "both" ? "feito" : "não registrado"],
                ["Tempo de treino", selectedDay.workoutMinutes ? minutes(selectedDay.workoutMinutes) : "--"],
                ["Cardio", selectedDay.cardioMinutes ? minutes(selectedDay.cardioMinutes) : "--"],
                ["Volume", `${Math.round(selectedDay.totalLoad).toLocaleString("pt-BR")}kg`],
                ["Observações", selectedDay.notes || "Sem observações"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-md border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="mt-1 font-semibold">{value}</p>
                </div>
              ))}
            </div>
            {selectedDay.exerciseLogs.length > 0 && (
              <div className="rounded-md border">
                {selectedDay.exerciseLogs.map((log) => (
                  <div key={log.exerciseId} className="flex items-center justify-between border-b px-3 py-2 text-sm last:border-b-0">
                    <span>{log.name}</span>
                    <span className="text-muted-foreground">
                      {log.sets}x{log.reps || "--"} · {log.load ? `${log.load}kg` : "--"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
}
