import { loadFitnessOverview } from "@/services/fitness-storage";

export const fitnessApi = {
  async overview() {
    return loadFitnessOverview();
  }
};
