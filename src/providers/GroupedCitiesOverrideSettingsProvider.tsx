import {useLocalStorage} from "usehooks-ts";
import type {GroupedCityRowSetting} from "../interfaces/GroupedCityRowSetting.ts";
import {type ReactNode, useRef, useState} from "react";
import {GroupedCitiesOverrideSettingsContext} from "../context/GroupedCitiesOverrideSettingsContext.ts";

export const GroupedCitiesOverrideSettingsProvider = (
  {children} : {children: ReactNode}
) => {
  const [groupedCitiesOverrideSettings, setGroupedCitiesOverrideSettings] = useLocalStorage<
    [string, GroupedCityRowSetting[]][]
  >(
    "groupedCitiesOverride",
    [],
  );
  
  const [defaultSettings, setDefaultSettings] = useState<GroupedCityRowSetting[]>(() => {
    console.debug("Default settings state init with default value")
    return [];
  });
  
  return (
    <GroupedCitiesOverrideSettingsContext value={{
      groupedCitiesOverrideSettings,
      setGroupedCitiesOverrideSettings,
      defaultSettings,
      setDefaultSettings,
    }}>
      {children}
    </GroupedCitiesOverrideSettingsContext>
  )
}