import type {City} from "../types/City.ts";
import {groupCities} from "./GroupCities.ts";

export function combineAllCities(citiesToCombine: City[]) {
  return groupCities(citiesToCombine, [{
    groupCandidates: [...new Set(citiesToCombine.map(city => city.cityName))].map(entry => ({
      name: entry,
      isEditable: false,
      id: entry
    })),
    groupedCityName: "All",
    id: "All",
    isModified: false,
    isUserCreated: false
  }])[0]
}