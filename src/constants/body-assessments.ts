export interface BodyAssessment {
  date: string;
  weight: number;
  bmi: number;
  bmiLabel: string;
  waistHipRatio: number;
  metabolicRisk: string;
  armMuscleCircumference: number;
  bodyFatPercent: number;
  fatMass: number;
  leanMass: number;
  skinfoldSum: number;
  waist: number;
  abdomen: number;
  chest: number;
  hip: number;
  calf: number;
}

export const bodyAssessments: BodyAssessment[] = [
  {
    date: "2026-05-14",
    weight: 84.35,
    bmi: 25.5,
    bmiLabel: "Sobrepeso",
    waistHipRatio: 0.81,
    metabolicRisk: "Baixo",
    armMuscleCircumference: 30.9,
    bodyFatPercent: 15.3,
    fatMass: 12.9,
    leanMass: 71.4,
    skinfoldSum: 106,
    waist: 84,
    abdomen: 95,
    chest: 107,
    hip: 104,
    calf: 38
  },
  {
    date: "2026-06-19",
    weight: 82.7,
    bmi: 25,
    bmiLabel: "Sobrepeso",
    waistHipRatio: 0.79,
    metabolicRisk: "Baixo",
    armMuscleCircumference: 30.9,
    bodyFatPercent: 13.5,
    fatMass: 11.1,
    leanMass: 71.6,
    skinfoldSum: 92,
    waist: 82.5,
    abdomen: 91.5,
    chest: 106,
    hip: 104,
    calf: 38
  },
  {
    date: "2026-07-17",
    weight: 82,
    bmi: 24.8,
    bmiLabel: "Adequado",
    waistHipRatio: 0.8,
    metabolicRisk: "Baixo",
    armMuscleCircumference: 30.7,
    bodyFatPercent: 13.3,
    fatMass: 10.9,
    leanMass: 71.1,
    skinfoldSum: 91,
    waist: 82.5,
    abdomen: 93,
    chest: 107,
    hip: 103,
    calf: 38.5
  }
];

export function bodyProgress() {
  const first = bodyAssessments[0];
  const latest = bodyAssessments[bodyAssessments.length - 1];
  const previous = bodyAssessments[bodyAssessments.length - 2];

  return {
    first,
    previous,
    latest,
    totalWeightDelta: latest.weight - first.weight,
    recentWeightDelta: latest.weight - previous.weight,
    totalBodyFatDelta: latest.bodyFatPercent - first.bodyFatPercent,
    recentBodyFatDelta: latest.bodyFatPercent - previous.bodyFatPercent,
    totalSkinfoldDelta: latest.skinfoldSum - first.skinfoldSum,
    totalFatMassDelta: latest.fatMass - first.fatMass,
    totalWaistDelta: latest.waist - first.waist,
    totalAbdomenDelta: latest.abdomen - first.abdomen
  };
}
