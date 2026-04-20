import {useQuery} from "@tanstack/react-query";
import type {City} from "../interfaces/City.ts";

export const useCreatorCities = (creator: string | null) => {
  return useQuery<City[]>({
    queryKey: ["cities", creator],
    queryFn: async () => {
      if (!creator) return [];

      const res = await fetch(`${import.meta.env.VITE_HOF_SERVER}/screenshots?creatorId=${creator}`);
      const data = await res.json();

      if (!res.ok) {
        return Promise.reject(new Error(`${data.statusCode}: ${data.message}`));
      }

      return data;
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });
}