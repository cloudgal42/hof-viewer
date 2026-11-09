import type { Favorites, Views} from "../../../types/City.ts";

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

export type WorkerMsg = {
  type: "progress";
  payload: {progressPercentage: number};
} | {
  type: "calculationCompleted";
  payload: TrendsData;
}