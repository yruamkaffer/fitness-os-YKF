import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DailyEntry, FitnessProfile, NutritionDay, WorkoutPlan } from "@/types/fitness";
import { kg, liters } from "@/utils/format";

interface CoachInput {
  profile: FitnessProfile;
  today: DailyEntry;
  yesterday?: DailyEntry;
  workout?: WorkoutPlan;
  nutrition: NutritionDay;
  streak: number;
}

export function generateDailyCoachReport(input: CoachInput) {
  const weekday = format(new Date(`${input.today.date}T12:00:00`), "EEEE", { locale: ptBR });
  const lost = input.profile.startWeight - input.profile.currentWeight;
  const remaining = input.profile.currentWeight - input.profile.goalWeight;
  const slept = input.yesterday?.sleepHours ?? input.today.sleepHours;
  const trainedYesterday = input.yesterday?.workoutMinutes ? "Ontem você treinou." : "Ontem foi um dia de recuperação.";
  const nextExercise = input.workout?.exercises.find((exercise) => exercise.name.toLowerCase().includes("remada"));

  return [
    `Bom dia. Hoje é ${weekday}.`,
    `Peso atual: ${kg(input.profile.currentWeight)}. Você perdeu ${kg(lost)} desde o início e faltam ${kg(remaining)} para a meta.`,
    `Hoje é treino de ${input.workout?.focus ?? "recuperação ativa"}. ${trainedYesterday}`,
    `Dormiu ${slept.toFixed(1).replace(".", ",")}h, bebeu ${liters(input.today.waterLiters)} e ${
      input.nutrition.supplements.every((item) => item.taken) ? "tomou todos os suplementos" : "ainda tem suplementos pendentes"
    }.`,
    nextExercise
      ? `Hoje tente subir 2kg na ${nextExercise.name.toLowerCase()} mantendo RPE ${nextExercise.rpe}.`
      : "Hoje priorize técnica, mobilidade e controle de respiração.",
    `Você está há ${input.streak} dias consecutivos em movimento. A meta da semana está ao alcance.`
  ].join(" ");
}
