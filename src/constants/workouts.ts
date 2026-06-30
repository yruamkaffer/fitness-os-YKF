import type { Exercise, WorkoutPlan } from "@/types/fitness";

function exercise(id: string, name: string, sets: number, reps: string, restSeconds = 90): Exercise {
  return {
    id,
    name,
    sets,
    reps,
    load: 0,
    rpe: 0,
    restSeconds,
    history: [],
    pr: 0
  };
}

export const weeklyWorkoutPlan: WorkoutPlan[] = [
  {
    weekday: 1,
    label: "Segunda",
    focus: "Peito + Ombro + Tríceps",
    groups: ["Peito", "Ombros", "Tríceps"],
    estimatedMinutes: 0,
    exercises: [
      exercise("supino-reto", "Supino reto", 4, "6-8", 120),
      exercise("supino-inclinado", "Supino inclinado", 3, "8-10"),
      exercise("crucifixo", "Crucifixo", 3, "10-12"),
      exercise("desenvolvimento", "Desenvolvimento militar", 4, "6-8", 120),
      exercise("lateral", "Elevação lateral", 4, "12-15", 60),
      exercise("testa", "Tríceps testa", 3, "8-10"),
      exercise("corda", "Tríceps corda", 3, "10-12", 60)
    ]
  },
  {
    weekday: 2,
    label: "Terça",
    focus: "Costas + Bíceps",
    groups: ["Costas", "Bíceps"],
    estimatedMinutes: 0,
    exercises: [
      exercise("barra", "Barra fixa", 4, "6-10", 120),
      exercise("remada-curvada", "Remada curvada", 4, "6-8", 120),
      exercise("pulldown", "Pulldown", 3, "8-10"),
      exercise("remada-unilateral", "Remada unilateral", 3, "10-12"),
      exercise("rosca-direta", "Rosca direta", 3, "8-10"),
      exercise("rosca-martelo", "Rosca martelo", 3, "10-12", 60)
    ]
  },
  {
    weekday: 3,
    label: "Quarta",
    focus: "Pernas",
    groups: ["Pernas", "Core"],
    estimatedMinutes: 0,
    exercises: [
      exercise("agachamento", "Agachamento", 4, "5-8", 150),
      exercise("leg-press", "Leg Press", 4, "10-12", 120),
      exercise("terra-romeno", "Terra romeno", 3, "8-10", 120),
      exercise("mesa-flexora", "Mesa flexora", 3, "10-12"),
      exercise("panturrilha", "Panturrilha", 5, "12-15", 60),
      exercise("abdomen", "Abdômen", 4, "12-20", 45)
    ]
  },
  {
    weekday: 4,
    label: "Quinta",
    focus: "Superior completo",
    groups: ["Peito", "Costas", "Ombros", "Bíceps", "Tríceps"],
    estimatedMinutes: 0,
    exercises: [
      exercise("supino-halter", "Supino halter", 3, "8-10"),
      exercise("remada-baixa", "Remada baixa", 3, "8-10"),
      exercise("arnold", "Desenvolvimento Arnold", 3, "10-12"),
      exercise("facepull", "Face pull", 3, "12-15", 60)
    ]
  },
  {
    weekday: 5,
    label: "Sexta",
    focus: "Pernas + Core",
    groups: ["Pernas", "Core"],
    estimatedMinutes: 0,
    exercises: [
      exercise("front-squat", "Agachamento frontal", 4, "6-8", 120),
      exercise("passada", "Passada", 3, "10-12"),
      exercise("cadeira-extensora", "Cadeira extensora", 4, "12-15", 60),
      exercise("prancha", "Prancha", 4, "45-75s", 45)
    ]
  },
  {
    weekday: 6,
    label: "Sábado",
    focus: "Cardio",
    groups: ["Cardio"],
    estimatedMinutes: 0,
    exercises: []
  },
  {
    weekday: 0,
    label: "Domingo",
    focus: "Descanso",
    groups: [],
    estimatedMinutes: 0,
    exercises: []
  }
];
