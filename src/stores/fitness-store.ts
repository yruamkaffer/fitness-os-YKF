import { create } from "zustand";
import type { DailyEntry } from "@/types/fitness";

interface FitnessState {
  selectedDay?: DailyEntry;
  setSelectedDay: (day?: DailyEntry) => void;
}

export const useFitnessStore = create<FitnessState>((set) => ({
  selectedDay: undefined,
  setSelectedDay: (day) => set({ selectedDay: day })
}));
