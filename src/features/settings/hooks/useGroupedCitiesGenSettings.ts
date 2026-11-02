import {useLocalStorage} from "usehooks-ts";
import type {GroupedCityGenSettings} from "../types/GroupedCityGenSettings.ts";

export const useGroupedCitiesGenSettings = () => {
  return useLocalStorage<GroupedCityGenSettings>(
    "groupedCitiesGenSettings",
    {
      useDefault: true,
      shareSettings: true,
    },
  );
}