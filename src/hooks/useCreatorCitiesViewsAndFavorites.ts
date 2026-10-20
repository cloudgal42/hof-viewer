import type {City, GroupedCities} from "../interfaces/City.ts";
import {useQuery} from "@tanstack/react-query";

export const useCreatorCitiesViewsAndFavorites = <T>(
  creator: string, select: (trendsData: City[]) => T
)=> {
  return useQuery<City[], Error, T>({
    queryKey: ["trendsData", creator],
    queryFn: async () => {
      if (!creator) return [];

      const res = await fetch(`${import.meta.env.VITE_HOF_SERVER}/screenshots?creatorId=${creator}&favorites=true&views=true`);
      const data = await res.json();

      if (!res.ok) {
        return Promise.reject(new Error(`${data.statusCode}: ${data.message}`));
      }

      return data;
    },
    refetchOnWindowFocus: false,
    select,
    staleTime: Infinity,
    enabled: false,
    retry: false,
  });
}