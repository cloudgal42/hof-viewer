import type {City} from "../interfaces/City.ts";
import type {GroupedCityRowSetting} from "../interfaces/GroupedCityRowSetting.ts";
import {useQuery} from "@tanstack/react-query";

function getSettingsFromQuery(data: City[]) {
  const cityNames = data.map(({ cityName }) => cityName);
  const uniqueCityNames = [...new Set(cityNames)];

  const cityNamesNoCase = cityNames.map((cityName) => cityName.toLowerCase());
  const uniqueCityNamesIgnoreCase = [...new Set(cityNamesNoCase)];

  const list: GroupedCityRowSetting[] = uniqueCityNamesIgnoreCase.map(
    (cityName, i) => {
      const matchingNames = uniqueCityNames.filter((name) =>
        name.toLowerCase() === cityName.toLowerCase()
      );
      return {
        ungroupedCityNames: matchingNames.map((name) => ({
          name: name,
          isEditable: false,
          id: crypto.randomUUID(),
        })),
        groupedCityName: uniqueCityNames[i],
        isUserCreated: false,
        id: crypto.randomUUID(),
      };
    },
  );

  return list;
}

export const useCreatorCitiesGroupedSettings = (
  creator: string,
  setter: (newVal: GroupedCityRowSetting[]) => void,
) => {
  return useQuery<GroupedCityRowSetting[]>({
    queryKey: ["cities", creator],
    queryFn: async () => {
      if (!creator) return [];

      const res = await fetch(
        `${import.meta.env.VITE_HOF_SERVER}/screenshots?creatorId=${creator}`,
      );
      const data = await res.json();

      if (!res.ok) {
        return Promise.reject(new Error(`${data.statusCode}: ${data.message}`));
      }

      const creatorSettings = getSettingsFromQuery(data);
      setter(creatorSettings);
      return creatorSettings;
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};