import { createContext, type Dispatch, type SetStateAction } from "react";
import type { GroupedCityRowSetting } from "../interfaces/GroupedCityRowSetting.ts";

export interface GroupedCitiesOverrideSettingsContextType {
  groupedCitiesOverrideSettings: [string, GroupedCityRowSetting[]][];
  defaultSettings: GroupedCityRowSetting[];
  setGroupedCitiesOverrideSettings: Dispatch<
    SetStateAction<[string, GroupedCityRowSetting[]][]>
  >;
  setDefaultSettings: Dispatch<SetStateAction<GroupedCityRowSetting[]>>;
}

export const GroupedCitiesOverrideSettingsContext = createContext<
  GroupedCitiesOverrideSettingsContextType | null
>(null);
