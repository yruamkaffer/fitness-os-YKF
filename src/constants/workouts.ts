import type { Exercise, WorkoutPlan } from "@/types/fitness";

function exercise(id: string, name: string, sets: number, reps: string, restSeconds = 90): Exercise {
  return { id, name, sets, reps, restSeconds };
}

export const weeklyWorkoutPlan: WorkoutPlan[] = [
  {
    weekday: 1,
    label: "Segunda",
    focus: "Peito + Ombro + Tríceps",
    groups: ["Peito", "Ombros", "Tríceps"],
    exercises: [
      exercise("supino-reto", "Supino reto", 4, "6-8", 120),
      exercise("supino-inclinado", "Supino inclinado", 3, "8-10"),
      exercise("crucifixo", "Crucifixo", 3, "10-12"),
      exercise("desenvolvimento-militar", "Desenvolvimento militar", 4, "8", 120),
      exercise("lateral", "Elevação lateral", 4, "12-15", 60),
      exercise("triceps-frances", "Tríceps francês", 3, "10-12", 60),
      exercise("triceps-testa", "Tríceps testa", 3, "10-12", 60)
    ]
  },
  {
    weekday: 2,
    label: "Terça",
    focus: "Costas + Bíceps",
    groups: ["Costas", "Bíceps"],
    exercises: [
      exercise("remada-curvada", "Remada curvada", 4, "6-8", 120),
      exercise("remada-unilateral-halter", "Remada unilateral com halter", 3, "8-10", 90),
      exercise("pullover-halter", "Pullover com halter", 3, "10-12", 90),
      exercise("encolhimento-trapezio", "Encolhimento para trapézio", 3, "12", 60),
      exercise("rosca-direta", "Rosca direta", 4, "8-10", 60),
      exercise("rosca-martelo", "Rosca martelo", 3, "10-12", 60),
      exercise("rosca-inclinada", "Rosca inclinada", 2, "12", 60)
    ]
  },
  {
    weekday: 3,
    label: "Quarta",
    focus: "Pernas",
    groups: ["Pernas", "Core"],
    exercises: [
      exercise("agachamento", "Agachamento", 4, "5-8", 150),
      exercise("terra-romeno", "Terra romeno", 3, "8-10", 120),
      exercise("afundo", "Afundo", 3, "10-12", 90),
      exercise("stiff", "Stiff", 3, "8-10", 120),
      exercise("panturrilha", "Panturrilha", 5, "12-15", 60),
      exercise("abdomen", "Abdômen", 4, "12-20", 45)
    ]
  },
  {
    weekday: 4,
    label: "Quinta",
    focus: "Superior completo",
    groups: ["Peito", "Costas", "Ombros", "Bíceps", "Tríceps"],
    exercises: [
      exercise("supino-inclinado-quinta", "Supino inclinado", 3, "8-10"),
      exercise("remada-curvada-quinta", "Remada curvada", 4, "6-8", 120),
      exercise("desenvolvimento-quinta", "Desenvolvimento", 3, "8-10", 90),
      exercise("remada-unilateral-quinta", "Remada unilateral", 3, "8-10", 90),
      exercise("rosca-direta-quinta", "Rosca direta", 3, "8-10", 60),
      exercise("triceps-testa-quinta", "Tríceps testa", 3, "10-12", 60)
    ]
  },
  {
    weekday: 5,
    label: "Sexta",
    focus: "Pernas + Core",
    groups: ["Pernas", "Core"],
    exercises: [
      exercise("front-squat", "Agachamento frontal ou goblet squat", 4, "6-8", 120),
      exercise("terra-romeno-sexta", "Terra romeno", 3, "8-10", 120),
      exercise("afundo-sexta", "Afundo", 3, "10-12", 90),
      exercise("panturrilha-sexta", "Panturrilha", 5, "12-15", 60),
      exercise("abdomen-sexta", "Abdômen", 4, "12-20", 45)
    ]
  },
  {
    weekday: 6,
    label: "Sábado",
    focus: "Cardio + Alongamento + Mobilidade",
    groups: ["Cardio"],
    exercises: [
      exercise("cardio-sabado", "Cardio", 1, "20-40min", 60),
      exercise("alongamento", "Alongamento", 1, "10-15min", 30),
      exercise("mobilidade", "Mobilidade", 1, "10-15min", 30)
    ]
  },
  {
    weekday: 0,
    label: "Domingo",
    focus: "Descanso ou cardio leve",
    groups: ["Cardio"],
    exercises: [exercise("cardio-leve-domingo", "Cardio leve se estiver disposto", 1, "20-30min", 60)]
  }
];
