import {useContext} from "react";
import {GroupedCitiesOverrideSettingsContext} from "../context/GroupedCitiesOverrideSettingsContext.ts";
import {useGroupedCitiesGenSettings} from "./useGroupedCitiesGenSettings.ts";
import type {City} from "../types/City.ts";
import {groupCities} from "../utils/GroupCities.ts";

export const useGroupedCities = (
  creator: string,
) => {
  const context = useContext(GroupedCitiesOverrideSettingsContext);
  
  if (!context) {
    throw new Error("useGroupedCities must be used within am GroupedCitiesOverrideSettingsProvider.");
  }
  
  const [groupedCitiesGenSettings] = useGroupedCitiesGenSettings();
  const {groupedCitiesOverrideSettings} = context;
  
  const settingUsed = groupedCitiesGenSettings.useDefault
    ? undefined
    : new Map(groupedCitiesOverrideSettings).get(creator)
  
  return {
    groupCities: (cities: City[]) => groupCities(cities, settingUsed)
  }
}