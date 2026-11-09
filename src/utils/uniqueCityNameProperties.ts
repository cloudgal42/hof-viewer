import type {CityNameProperties} from "../types/CityNameProperties.ts";

export function getUniqueCityNameProperties(
  cityNamesProperties: CityNameProperties[]
) {
  return [...new Map(
    cityNamesProperties.map(entry => [entry["cityName"], entry])
  ).values()];
}