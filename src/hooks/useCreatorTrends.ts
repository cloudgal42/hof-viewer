import {useQuery} from "@tanstack/react-query";
import type {City, GroupedCities} from "../interfaces/City.ts";
import {groupCities} from "../utils/GroupCities.ts";

export const useCreatorTrends = (
  {creator, cityName} : {creator: string | undefined; cityName?: string}
) => {
  return useQuery<City[], Error, GroupedCities[] | undefined>({
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
    staleTime: Infinity,
    select: cityName
      ? (trendsData) => groupCities(trendsData).filter(entry => entry.cityName === cityName)
      : (trendsData) => groupCities(trendsData),
    enabled: false,
    retry: false,
  });
}