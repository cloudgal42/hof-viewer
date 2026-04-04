import { useQuery } from "@tanstack/react-query";
import type { City } from "../interfaces/City.ts";

export const useCreatorCities = ({
  creator,
  getViewsAndFavData,
  enabled,
} : {
  creator: string | null,
  getViewsAndFavData?: boolean,
  enabled?: boolean,
}) => {
  return useQuery<City[]>({
    queryKey: ["cities", creator],
    queryFn: async () => {
      if (!creator) return [];

      const fetchLink = getViewsAndFavData
        ? `${import.meta.env.VITE_HOF_SERVER}/screenshots?creatorId=${creator}&favorites=true&views=true`
        : `${import.meta.env.VITE_HOF_SERVER}/screenshots?creatorId=${creator}`

      const res = await fetch(fetchLink);
      const data = await res.json();

      if (!res.ok) {
        return Promise.reject(new Error(`${data.statusCode}: ${data.message}`));
      }

      return data;
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: (typeof enabled === "undefined") ? true : enabled,
    retry: false,
  });
};
