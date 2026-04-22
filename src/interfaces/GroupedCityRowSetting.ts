import type {UngroupedCityName} from "./UngroupedCityName.ts";

export interface GroupedCityRowSetting {
  ungroupedCityNames: UngroupedCityName[];
  groupedCityName: string;
  translatedGroupedCityName?: string;
  isUserCreated: boolean;
  id: string;
}