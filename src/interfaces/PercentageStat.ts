import type {City} from "./City.ts";

export interface PercentageStat {
  id: string;
  label: string;
  data: number[];
  backgroundColor: string;
  details: City
}