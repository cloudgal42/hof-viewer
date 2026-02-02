import type {City, GroupedCities} from "./City.ts";

export interface TrendsData {
  [key: string]: number;
}

export interface WorkerParams {
  city: City | GroupedCities,
  day: number,
  type: string,
}