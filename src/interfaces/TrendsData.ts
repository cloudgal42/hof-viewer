import type {City, Favorites, GroupedCities, Views} from "./City.ts";

export interface TrendsData {
  [key: number]: number;
}

export interface WorkerParams {
  inputData: TrendsWorkerInput
  day: number,
  type: string,
}

export interface TrendsWorkerInput {
  createdAt: string;
  views: Views[] | undefined;
  favorites: Favorites[] | undefined;
}