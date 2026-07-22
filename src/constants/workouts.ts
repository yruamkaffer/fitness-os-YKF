import type { Exercise, WorkoutPlan } from "@/types/fitness";

function exercise(id: string, name: string, sets: number, reps: string, restSeconds = 90): Exercise {
  return { id, name, sets, reps, restSeconds };
}

export const weeklyWorkoutPlan: WorkoutPlan[] = [
  {
    weekday: 1,
    label: "Segunda",
    focus: "Upper estético express",
    groups: ["Peito", "Costas", "Ombros", "Bíceps", "Tríceps"],
    exercises: [
      exercise("supino-inclinado", "Supino inclinado com barra", 3, "6-10", 120),
      exercise("remada-curvada", "Remada curvada", 3, "8-10", 120),
      exercise("lateral", "Elevação lateral", 3, "12-20", 60),
      exercise("rosca-direta", "Rosca direta (bi-set)", 2, "10-12", 60),
      exercise("triceps-testa", "Tríceps testa (bi-set)", 2, "10-12", 60)
    ]
  },
  {
    weekday: 2,
    label: "Terça",
    focus: "Pernas A · Força e preservação muscular",
    groups: ["Pernas", "Core"],
    exercises: [
      exercise("agachamento", "Agachamento livre", 4, "5-8", 150),
      exercise("terra-romeno", "Terra romeno", 4, "6-10", 120),
      exercise("afundo", "Afundo com halteres", 3, "8-12 por perna", 90),
      exercise("hip-thrust", "Hip thrust com barra", 3, "8-12", 90),
      exercise("panturrilha", "Panturrilha em pé", 4, "12-20", 60),
      exercise("copenhagen-plank", "Copenhagen plank", 2, "20-30s por lado", 45)
    ]
  },
  {
    weekday: 3,
    label: "Quarta",
    focus: "Upper hipertrofia e estética",
    groups: ["Peito", "Costas", "Ombros", "Bíceps", "Tríceps"],
    exercises: [
      exercise("supino-reto", "Supino reto com barra", 4, "6-10", 120),
      exercise("remada-unilateral", "Remada unilateral com halter", 4, "8-12 por lado", 90),
      exercise("supino-inclinado-halteres", "Supino inclinado com halteres", 3, "8-12", 90),
      exercise("pullover-halter", "Pullover com halter", 3, "10-15", 75),
      exercise("lateral", "Elevação lateral", 4, "12-20", 60),
      exercise("face-pull-elastico", "Face pull com elástico", 3, "15-20", 60),
      exercise("rosca-martelo", "Rosca martelo", 3, "8-12", 60),
      exercise("triceps-frances", "Tríceps francês", 3, "8-12", 60)
    ]
  },
  {
    weekday: 4,
    label: "Quinta",
    focus: "Futebol Performance Express",
    groups: ["Pernas", "Core", "Cardio"],
    exercises: [
      exercise("mobilidade-dinamica", "Mobilidade dinâmica: tornozelo, quadril, balanço de pernas e rotação de tronco", 1, "4-5min", 15),
      exercise("monster-walk", "Monster walk com elástico", 2, "12 passos por lado", 45),
      exercise("ponte-gluteo-elastico", "Ponte de glúteo com elástico", 2, "15", 45),
      exercise("pogos", "Pogos ou saltos curtos de tornozelo", 3, "15-20s", 60),
      exercise("salto-horizontal", "Salto horizontal ou agachamento com salto", 3, "3-5", 90),
      exercise("med-ball-slam", "Med ball slam", 3, "5-8", 60),
      exercise("prancha-lateral", "Prancha lateral", 2, "30s por lado", 45)
    ]
  },
  {
    weekday: 5,
    label: "Sexta",
    focus: "Pernas B + Ombros",
    groups: ["Pernas", "Ombros", "Core"],
    exercises: [
      exercise("bulgarian-split-squat", "Bulgarian split squat", 3, "8-12 por perna", 90),
      exercise("stiff", "Stiff com barra ou halteres", 3, "8-12", 120),
      exercise("hip-thrust", "Hip thrust", 3, "10-15", 90),
      exercise("flexao-joelho-elastico", "Flexão de joelho com elástico", 3, "12-20", 60),
      exercise("panturrilha-unilateral", "Panturrilha unilateral", 4, "12-20 por lado", 60),
      exercise("lateral", "Elevação lateral", 3, "15-20", 60),
      exercise("crucifixo-inverso", "Crucifixo inverso com halteres ou elástico", 3, "12-20", 60),
      exercise("abdominal-reverso", "Abdominal reverso", 3, "12-15", 45)
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
