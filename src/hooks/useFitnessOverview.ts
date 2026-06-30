import { useQuery } from "@tanstack/react-query";
import { fitnessApi } from "@/api/fitnessApi";

export function useFitnessOverview() {
  return useQuery({
    queryKey: ["fitness-overview"],
    queryFn: fitnessApi.overview
  });
}
