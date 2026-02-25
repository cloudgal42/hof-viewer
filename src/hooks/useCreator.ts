import {useQuery} from "@tanstack/react-query";
import type {CreatorDetails} from "../interfaces/Creator.ts";

export const useCreator = (creator: string | null) => {
  return useQuery<CreatorDetails>({
    queryKey: ["creator", creator],
    queryFn: async () => {
      if (!creator) return null;
      const [creatorRes, creatorStatsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_HOF_SERVER}/creators/${creator}`),
        fetch(`${import.meta.env.VITE_HOF_SERVER}/creators/${creator}/stats`),
      ]);

      const [creatorData, creatorStats] = await Promise.all([
        creatorRes.json(),
        creatorStatsRes.json(),
      ]);

      if (!creatorRes.ok || !creatorStatsRes) {
        return Promise.reject(new Error(`${creatorData.statusCode}: ${creatorStats.message}`));
      }

      return {
        ...creatorData,
        ...creatorStats,
      }
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });
}