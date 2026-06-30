import { useCallback, useEffect, useState } from "react";
import {
  loadFitnessOverview,
  markTodayWorkout,
  saveFitnessOverview,
  todayISO,
  updateProfile,
  upsertEntry
} from "@/services/fitness-storage";
import type { DailyEntryInput, FitnessProfile } from "@/types/fitness";

export function useFitnessOverview() {
  const [data, setData] = useState(loadFitnessOverview);

  const commit = useCallback((next: typeof data) => {
    saveFitnessOverview(next);
    setData(next);
    window.dispatchEvent(new Event("fitness-os:update"));
  }, []);

  useEffect(() => {
    function syncData() {
      setData(loadFitnessOverview());
    }

    window.addEventListener("fitness-os:update", syncData);
    window.addEventListener("storage", syncData);
    return () => {
      window.removeEventListener("fitness-os:update", syncData);
      window.removeEventListener("storage", syncData);
    };
  }, []);

  const saveProfile = useCallback(
    (patch: Partial<FitnessProfile>) => {
      commit(updateProfile(data, patch));
    },
    [commit, data]
  );

  const saveEntry = useCallback(
    (entry: DailyEntryInput) => {
      commit(upsertEntry(data, entry));
    },
    [commit, data]
  );

  const markTodayTrained = useCallback(() => {
    commit(markTodayWorkout(data));
  }, [commit, data]);

  return {
    data,
    isLoading: false,
    today: todayISO(),
    saveProfile,
    saveEntry,
    markTodayTrained
  };
}
