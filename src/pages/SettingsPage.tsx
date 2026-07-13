import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoadingState } from "@/components/ui/loading-state";
import { useFitnessOverview } from "@/hooks/useFitnessOverview";
import { minutes, optionalKg } from "@/utils/format";

export function SettingsPage() {
  const { data, isLoading, removeEntry } = useFitnessOverview();
  const entries = [...data.entries].sort((a, b) => b.date.localeCompare(a.date));

  if (isLoading) return <PageLoadingState />;

  function deleteRecord(date: string) {
    const confirmed = window.confirm(`Excluir o registro de ${new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR")}?`);
    if (confirmed) removeEntry(date);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Configurações</p>
        <h1 className="text-3xl font-black tracking-normal">Dados e registros</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Armazenamento</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Seus registros ficam salvos neste dispositivo quando o Supabase não aceita escrita.
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Registros salvos</CardTitle>
          <p className="text-sm text-muted-foreground">{entries.length} dia(s) com dados cadastrados.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {entries.length === 0 ? (
            <div className="rounded-md border bg-muted/20 p-4 text-sm text-muted-foreground">Nenhum registro salvo ainda.</div>
          ) : (
            entries.map((entry) => (
              <div key={entry.date} className="flex flex-col gap-3 rounded-md border bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{new Date(`${entry.date}T12:00:00`).toLocaleDateString("pt-BR")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {entry.status} · peso {optionalKg(entry.weight)} · treino {entry.workoutMinutes ? minutes(entry.workoutMinutes) : "--"} · cardio{" "}
                    {entry.cardioMinutes ? minutes(entry.cardioMinutes) : "--"} · {entry.exerciseLogs.length} exercício(s)
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    className="inline-flex h-8 items-center justify-center gap-2 rounded-md border bg-transparent px-3 text-xs font-semibold transition hover:bg-muted"
                    to={`/calendar?date=${entry.date}`}
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => deleteRecord(entry.date)} type="button">
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
