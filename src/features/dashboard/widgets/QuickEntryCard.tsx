import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailyEntryInput, FitnessProfile } from "@/types/fitness";

interface QuickEntryCardProps {
  profile: FitnessProfile;
  today: string;
  onSaveProfile: (profile: Partial<FitnessProfile>) => void;
  onSaveEntry: (entry: DailyEntryInput) => void;
}

function toNumber(value: string) {
  if (!value.trim()) return null;
  const normalized = value.replace(",", ".");
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

export function QuickEntryCard({ profile, today, onSaveProfile, onSaveEntry }: QuickEntryCardProps) {
  const [name, setName] = useState(profile.name);
  const [startWeight, setStartWeight] = useState(profile.startWeight?.toString() ?? "");
  const [goalWeight, setGoalWeight] = useState(profile.goalWeight?.toString() ?? "");
  const [date, setDate] = useState(today);
  const [weight, setWeight] = useState(profile.currentWeight?.toString() ?? "");
  const [workoutMinutes, setWorkoutMinutes] = useState("");
  const [cardioMinutes, setCardioMinutes] = useState("");
  const [totalLoad, setTotalLoad] = useState("");
  const [mood, setMood] = useState("");
  const [energy, setEnergy] = useState("");
  const [notes, setNotes] = useState("");

  function saveProfile() {
    onSaveProfile({
      name: name.trim() || "Você",
      startWeight: toNumber(startWeight),
      goalWeight: toNumber(goalWeight)
    });
  }

  function saveEntry() {
    const parsedWorkout = toNumber(workoutMinutes);
    const parsedCardio = toNumber(cardioMinutes);
    const hasWorkout = parsedWorkout !== null;
    const hasCardio = parsedCardio !== null;
    const workoutValue = parsedWorkout ?? 0;
    const cardioValue = parsedCardio ?? 0;
    const status = workoutValue > 0 && cardioValue > 0 ? "both" : workoutValue > 0 ? "workout" : cardioValue > 0 ? "cardio" : "none";
    const entry: DailyEntryInput = {
      date,
      weight: toNumber(weight),
      mood: toNumber(mood),
      energy: toNumber(energy),
      notes
    };

    if (hasWorkout || hasCardio) {
      entry.status = status;
      entry.workoutMinutes = workoutValue;
      entry.cardioMinutes = cardioValue;
    }

    const parsedLoad = toNumber(totalLoad);
    if (parsedLoad !== null) {
      entry.totalLoad = parsedLoad;
    }

    onSaveEntry(entry);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar dados reais</CardTitle>
        <p className="text-sm text-muted-foreground">Preencha só o que você tiver. Campos vazios ficam sem dado.</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 md:grid-cols-4">
          <input className="h-10 rounded-md border bg-background px-3 text-sm" placeholder="Nome" value={name} onChange={(event) => setName(event.target.value)} />
          <input className="h-10 rounded-md border bg-background px-3 text-sm" placeholder="Peso inicial" inputMode="decimal" value={startWeight} onChange={(event) => setStartWeight(event.target.value)} />
          <input className="h-10 rounded-md border bg-background px-3 text-sm" placeholder="Meta de peso" inputMode="decimal" value={goalWeight} onChange={(event) => setGoalWeight(event.target.value)} />
          <Button variant="secondary" onClick={saveProfile}>
            <Save className="h-4 w-4" />
            Salvar perfil
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <input className="h-10 rounded-md border bg-background px-3 text-sm" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          <input className="h-10 rounded-md border bg-background px-3 text-sm" placeholder="Peso do dia" inputMode="decimal" value={weight} onChange={(event) => setWeight(event.target.value)} />
          <input className="h-10 rounded-md border bg-background px-3 text-sm" placeholder="Min treino" inputMode="numeric" value={workoutMinutes} onChange={(event) => setWorkoutMinutes(event.target.value)} />
          <input className="h-10 rounded-md border bg-background px-3 text-sm" placeholder="Min cardio" inputMode="numeric" value={cardioMinutes} onChange={(event) => setCardioMinutes(event.target.value)} />
          <input className="h-10 rounded-md border bg-background px-3 text-sm" placeholder="Carga total kg" inputMode="numeric" value={totalLoad} onChange={(event) => setTotalLoad(event.target.value)} />
          <input className="h-10 rounded-md border bg-background px-3 text-sm" placeholder="Humor 1-5" inputMode="numeric" value={mood} onChange={(event) => setMood(event.target.value)} />
          <input className="h-10 rounded-md border bg-background px-3 text-sm" placeholder="Energia 1-5" inputMode="numeric" value={energy} onChange={(event) => setEnergy(event.target.value)} />
          <Button onClick={saveEntry}>
            <Save className="h-4 w-4" />
            Salvar dia
          </Button>
        </div>

        <textarea
          className="min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm"
          placeholder="Observações do dia"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </CardContent>
    </Card>
  );
}
