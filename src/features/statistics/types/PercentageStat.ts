import type {City} from "../../../types/City.ts";

export interface PercentageStat {
  id: string;
  label: string;
  data: number[];
  backgroundColor: string;
  details: City
  link: string;
}