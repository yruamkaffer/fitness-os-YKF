import type { Exercise, WorkoutPlan } from "@/types/fitness";

function exercise(id: string, name: string, sets: number, reps: string, restSeconds = 90): Exercise {
  return { id, name, sets, reps, restSeconds };
}

export const weeklyWorkoutPlan: WorkoutPlan[] = [
  {
    weekday: 1,
    label: "Segunda",
    focus: "Upper Express",
    groups: ["Peito", "Costas", "Ombros", "Bíceps", "Tríceps"],
    exercises: [
      exercise("supino-reto", "Supino reto", 3, "6-8", 120),
      exercise("remada-curvada", "Remada curvada", 3, "8-10", 120),
      exercise("desenvolvimento-militar", "Desenvolvimento militar", 2, "10", 90),
      exercise("rosca-direta", "Rosca direta", 2, "10-12", 60),
      exercise("triceps-testa", "Tríceps testa", 2, "10-12", 60)
    ]
  },
  {
    weekday: 2,
    label: "Terça",
    focus: "Pernas A · Força",
    groups: ["Pernas", "Core"],
    exercises: [
      exercise("agachamento", "Agachamento livre", 4, "6-8", 150),
      exercise("terra-romeno", "Terra romeno", 4, "8", 120),
      exercise("afundo", "Afundo", 3, "10 cada perna", 90),
      exercise("panturrilha", "Panturrilha", 4, "15", 60),
      exercise("prancha", "Prancha", 3, "45-60s", 45),
      exercise("elevacao-pernas", "Elevação de pernas", 3, "12", 45)
    ]
  },
  {
    weekday: 3,
    label: "Quarta",
    focus: "Peito + Ombro + Tríceps",
    groups: ["Peito", "Ombros", "Tríceps"],
    exercises: [
      exercise("supino-inclinado", "Supino inclinado", 4, "8", 120),
      exercise("supino-reto-halteres", "Supino reto com halteres", 3, "10", 90),
      exercise("crucifixo", "Crucifixo", 3, "12", 75),
      exercise("desenvolvimento-militar", "Desenvolvimento militar", 3, "8", 120),
      exercise("lateral", "Elevação lateral", 3, "15", 60),
      exercise("triceps-frances", "Tríceps francês", 3, "10", 60),
      exercise("triceps-testa", "Tríceps testa", 3, "12", 60)
    ]
  },
  {
    weekday: 4,
    label: "Quinta",
    focus: "Costas + Bíceps",
    groups: ["Costas", "Bíceps"],
    exercises: [
      exercise("remada-curvada", "Remada curvada", 4, "8", 120),
      exercise("remada-unilateral", "Remada unilateral", 3, "10", 90),
      exercise("pullover-halter", "Pullover com halter", 3, "12", 90),
      exercise("encolhimento", "Encolhimento", 3, "12", 60),
      exercise("rosca-direta", "Rosca direta", 4, "8-10", 60),
      exercise("rosca-martelo", "Rosca martelo", 3, "10-12", 60),
      exercise("rosca-inclinada", "Rosca inclinada", 2, "12", 60)
    ]
  },
  {
    weekday: 5,
    label: "Sexta",
    focus: "Pernas B + Core",
    groups: ["Pernas", "Core"],
    exercises: [
      exercise("front-squat", "Agachamento frontal ou Goblet", 4, "8", 120),
      exercise("stiff", "Stiff", 4, "8", 120),
      exercise("passada", "Passada", 3, "12", 90),
      exercise("flexora", "Flexora ou Nordic improvisado", 3, "10", 90),
      exercise("panturrilha", "Panturrilha", 4, "15", 60),
      exercise("prancha-lateral", "Prancha lateral", 3, "40s", 45),
      exercise("abdominal-infra", "Abdominal infra", 3, "15", 45)
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
