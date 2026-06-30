import { achievements, dailyEntries, goals, profile, todayNutrition } from "@/database/seed";
import { weeklyWorkoutPlan } from "@/constants/workouts";

export const fitnessApi = {
  async overview() {
    return {
      profile,
      entries: dailyEntries,
      nutrition: todayNutrition,
      goals,
      achievements,
      workoutPlan: weeklyWorkoutPlan
    };
  }
};
