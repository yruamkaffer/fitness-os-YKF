import { create } from "zustand";
import type { DailyEntry } from "@/types/fitness";

interface FitnessState {
  selectedDay?: DailyEntry;
  setSelectedDay: (day?: DailyEntry) => void;
  markTodayTrained: () => void;
  trainedToday: boolean;
}

export const useFitnessStore = create<FitnessState>((set) => ({
  selectedDay: undefined,
  trainedToday: false,
  setSelectedDay: (day) => set({ selectedDay: day }),
  markTodayTrained: () => set({ trainedToday: true })
}));
