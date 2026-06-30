import { useCallback, useEffect, useState } from "react";
import {
  emptyOverview,
  loadFitnessOverview,
  markTodayWorkout,
  todayISO,
  updateProfile,
  upsertEntry
} from "@/services/fitness-storage";
import type { DailyEntryInput, FitnessProfile } from "@/types/fitness";

export function useFitnessOverview() {
  const [data, setData] = useState(emptyOverview);
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(async () => {
    setIsLoading(true);
    const overview = await loadFitnessOverview();
    setData(overview);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void reload();

    function syncData() {
      void reload();
    }

    window.addEventListener("fitness-os:update", syncData);
    window.addEventListener("storage", syncData);
    return () => {
      window.removeEventListener("fitness-os:update", syncData);
      window.removeEventListener("storage", syncData);
    };
  }, [reload]);

  const commit = useCallback(async (next: Promise<typeof data>) => {
    const overview = await next;
    setData(overview);
    window.dispatchEvent(new Event("fitness-os:update"));
  }, []);

  const saveProfile = useCallback(
    (patch: Partial<FitnessProfile>) => {
      void commit(updateProfile(data, patch));
    },
    [commit, data]
  );

  const saveEntry = useCallback(
    (entry: DailyEntryInput) => {
      void commit(upsertEntry(data, entry));
    },
    [commit, data]
  );

  const markTodayTrained = useCallback(() => {
    void commit(markTodayWorkout(data));
  }, [commit, data]);

  return {
    data,
    isLoading,
    today: todayISO(),
    saveProfile,
    saveEntry,
    markTodayTrained
  };
}
