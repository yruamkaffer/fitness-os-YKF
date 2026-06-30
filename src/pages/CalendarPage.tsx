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

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Calendário anual</p>
        <h1 className="text-3xl font-black tracking-normal">Heatmap de consistência</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Atividade diária</CardTitle>
          <p className="text-sm text-muted-foreground">Clique em qualquer dia para abrir peso, treino, cardio, humor, energia e observações.</p>
        </CardHeader>
        <CardContent>
          {data.entries.length === 0 ? (
            <div className="rounded-md border bg-muted/20 p-6 text-sm text-muted-foreground">
              Nenhum dia registrado ainda. Use o painel inicial para cadastrar seu primeiro peso, treino ou cardio.
            </div>
          ) : (
            <FitnessHeatmap entries={data.entries} onSelect={setSelectedDay} />
          )}
        </CardContent>
      </Card>
      <Dialog open={Boolean(selectedDay)} title={selectedDay?.date ?? "Dia"} onClose={() => setSelectedDay(undefined)}>
        {selectedDay && (
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Peso", optionalKg(selectedDay.weight)],
              ["Treino", minutes(selectedDay.workoutMinutes)],
              ["Cardio", minutes(selectedDay.cardioMinutes)],
              ["Humor", selectedDay.mood ? `${selectedDay.mood}/5` : "--"],
              ["Energia", selectedDay.energy ? `${selectedDay.energy}/5` : "--"],
              ["Carga levantada", `${selectedDay.totalLoad.toLocaleString("pt-BR")}kg`],
              ["Observações", selectedDay.notes || "Sem observações"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 font-semibold">{value}</p>
              </div>
            ))}
          </div>
        )}
      </Dialog>
    </div>
  );
}
