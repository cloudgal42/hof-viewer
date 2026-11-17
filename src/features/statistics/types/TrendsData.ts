import type { Favorites, Views} from "../../../types/City.ts";

export interface TrendsData {
  [key: string]: number;
}

export type GroupPeriod = "day" | "week" | "month" | "halfyear" | "year";

export interface WorkerParams {
  inputData: TrendsWorkerInput,
	period: "day" | "week" | "month" | "halfyear" | "year",
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
