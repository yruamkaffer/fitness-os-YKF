import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DailyEntry, FitnessProfile, WorkoutPlan } from "@/types/fitness";
import { kg } from "@/utils/format";

interface CoachInput {
  profile: FitnessProfile;
  today?: DailyEntry;
  yesterday?: DailyEntry;
  workout?: WorkoutPlan;
  streak: number;
  entriesCount: number;
}

export function generateDailyCoachReport(input: CoachInput) {
  const date = input.today?.date ? new Date(`${input.today.date}T12:00:00`) : new Date();
  const weekday = format(date, "EEEE", { locale: ptBR });
  const currentWeight = input.profile.currentWeight ?? input.today?.weight ?? null;

  if (input.entriesCount === 0) {
    return `Bom dia. Hoje é ${weekday}. Seu FITNESS OS está limpo e pronto para dados reais. Registre seu peso atual, sua meta e depois use o botão Treinei hoje quando concluir um treino.`;
  }

  const weightMessage =
    currentWeight !== null && input.profile.startWeight !== null && input.profile.goalWeight !== null
      ? `Peso atual: ${kg(currentWeight)}. Você está acompanhando a meta de ${kg(input.profile.goalWeight)}.`
      : "Peso e meta ainda não estão completos.";

  const yesterdayMessage = input.yesterday?.status === "workout" || input.yesterday?.status === "both"
    ? "Ontem você treinou."
    : input.yesterday?.status === "cardio"
      ? "Ontem você fez cardio."
      : "Sem registro de treino ontem.";

  const progressionHint = input.workout?.exercises[0]
    ? `No treino de hoje, comece pelo exercício ${input.workout.exercises[0].name} e registre a carga ao final.`
    : "Hoje pode ser um dia de descanso ou cardio leve, se fizer sentido para sua rotina.";

  return [
    `Bom dia. Hoje é ${weekday}.`,
    weightMessage,
    `Treino planejado: ${input.workout?.focus ?? "sem treino cadastrado para hoje"}.`,
    yesterdayMessage,
    `Sequência atual: ${input.streak} dia(s).`,
    progressionHint
  ].join(" ");
}
