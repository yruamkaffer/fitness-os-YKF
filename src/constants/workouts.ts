import type { WorkoutPlan } from "@/types/fitness";

const makeHistory = (base: number) => [
  { date: "2026-06-02", load: base - 4, reps: 8 },
  { date: "2026-06-09", load: base - 2, reps: 8 },
  { date: "2026-06-16", load: base, reps: 7 },
  { date: "2026-06-23", load: base, reps: 8 }
];

export const weeklyWorkoutPlan: WorkoutPlan[] = [
  {
    weekday: 1,
    label: "Segunda",
    focus: "Peito + Ombro + Tríceps",
    groups: ["Peito", "Ombros", "Tríceps"],
    estimatedMinutes: 72,
    exercises: [
      { id: "supino-reto", name: "Supino reto", sets: 4, reps: "6-8", load: 82, rpe: 8, restSeconds: 120, history: makeHistory(82), pr: 90 },
      { id: "supino-inclinado", name: "Supino inclinado", sets: 3, reps: "8-10", load: 64, rpe: 8, restSeconds: 90, history: makeHistory(64), pr: 70 },
      { id: "crucifixo", name: "Crucifixo", sets: 3, reps: "10-12", load: 22, rpe: 7, restSeconds: 60, history: makeHistory(22), pr: 26 },
      { id: "desenvolvimento", name: "Desenvolvimento militar", sets: 4, reps: "6-8", load: 46, rpe: 8, restSeconds: 120, history: makeHistory(46), pr: 52 },
      { id: "lateral", name: "Elevação lateral", sets: 4, reps: "12-15", load: 12, rpe: 9, restSeconds: 60, history: makeHistory(12), pr: 16 },
      { id: "testa", name: "Tríceps testa", sets: 3, reps: "8-10", load: 30, rpe: 8, restSeconds: 75, history: makeHistory(30), pr: 34 },
      { id: "corda", name: "Tríceps corda", sets: 3, reps: "10-12", load: 36, rpe: 8, restSeconds: 60, history: makeHistory(36), pr: 42 }
    ]
  },
  {
    weekday: 2,
    label: "Terça",
    focus: "Costas + Bíceps",
    groups: ["Costas", "Bíceps"],
    estimatedMinutes: 68,
    exercises: [
      { id: "barra", name: "Barra fixa", sets: 4, reps: "6-10", load: 0, rpe: 8, restSeconds: 120, history: makeHistory(0), pr: 12 },
      { id: "remada-curvada", name: "Remada curvada", sets: 4, reps: "6-8", load: 78, rpe: 8, restSeconds: 120, history: makeHistory(78), pr: 86 },
      { id: "pulldown", name: "Pulldown", sets: 3, reps: "8-10", load: 70, rpe: 8, restSeconds: 90, history: makeHistory(70), pr: 78 },
      { id: "remada-unilateral", name: "Remada unilateral", sets: 3, reps: "10-12", load: 34, rpe: 8, restSeconds: 75, history: makeHistory(34), pr: 40 },
      { id: "rosca-direta", name: "Rosca direta", sets: 3, reps: "8-10", load: 34, rpe: 8, restSeconds: 75, history: makeHistory(34), pr: 40 },
      { id: "rosca-martelo", name: "Rosca martelo", sets: 3, reps: "10-12", load: 18, rpe: 8, restSeconds: 60, history: makeHistory(18), pr: 22 }
    ]
  },
  {
    weekday: 3,
    label: "Quarta",
    focus: "Pernas",
    groups: ["Pernas", "Core"],
    estimatedMinutes: 76,
    exercises: [
      { id: "agachamento", name: "Agachamento", sets: 4, reps: "5-8", load: 118, rpe: 8, restSeconds: 150, history: makeHistory(118), pr: 132 },
      { id: "leg-press", name: "Leg Press", sets: 4, reps: "10-12", load: 240, rpe: 8, restSeconds: 120, history: makeHistory(240), pr: 280 },
      { id: "terra-romeno", name: "Terra romeno", sets: 3, reps: "8-10", load: 96, rpe: 8, restSeconds: 120, history: makeHistory(96), pr: 110 },
      { id: "mesa-flexora", name: "Mesa flexora", sets: 3, reps: "10-12", load: 48, rpe: 8, restSeconds: 75, history: makeHistory(48), pr: 58 },
      { id: "panturrilha", name: "Panturrilha", sets: 5, reps: "12-15", load: 82, rpe: 8, restSeconds: 60, history: makeHistory(82), pr: 96 },
      { id: "abdomen", name: "Abdômen", sets: 4, reps: "12-20", load: 0, rpe: 7, restSeconds: 45, history: makeHistory(0), pr: 20 }
    ]
  },
  {
    weekday: 4,
    label: "Quinta",
    focus: "Superior completo",
    groups: ["Peito", "Costas", "Ombros", "Bíceps", "Tríceps"],
    estimatedMinutes: 70,
    exercises: [
      { id: "supino-halter", name: "Supino halter", sets: 3, reps: "8-10", load: 34, rpe: 8, restSeconds: 90, history: makeHistory(34), pr: 40 },
      { id: "remada-baixa", name: "Remada baixa", sets: 3, reps: "8-10", load: 74, rpe: 8, restSeconds: 90, history: makeHistory(74), pr: 82 },
      { id: "arnold", name: "Desenvolvimento Arnold", sets: 3, reps: "10-12", load: 20, rpe: 8, restSeconds: 75, history: makeHistory(20), pr: 24 },
      { id: "facepull", name: "Face pull", sets: 3, reps: "12-15", load: 32, rpe: 7, restSeconds: 60, history: makeHistory(32), pr: 38 }
    ]
  },
  {
    weekday: 5,
    label: "Sexta",
    focus: "Pernas + Core",
    groups: ["Pernas", "Core"],
    estimatedMinutes: 74,
    exercises: [
      { id: "front-squat", name: "Agachamento frontal", sets: 4, reps: "6-8", load: 82, rpe: 8, restSeconds: 120, history: makeHistory(82), pr: 94 },
      { id: "passada", name: "Passada", sets: 3, reps: "10-12", load: 28, rpe: 8, restSeconds: 90, history: makeHistory(28), pr: 34 },
      { id: "cadeira-extensora", name: "Cadeira extensora", sets: 4, reps: "12-15", load: 64, rpe: 9, restSeconds: 60, history: makeHistory(64), pr: 76 },
      { id: "prancha", name: "Prancha", sets: 4, reps: "45-75s", load: 0, rpe: 8, restSeconds: 45, history: makeHistory(0), pr: 90 }
    ]
  },
  {
    weekday: 6,
    label: "Sábado",
    focus: "Cardio",
    groups: ["Cardio"],
    estimatedMinutes: 45,
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
