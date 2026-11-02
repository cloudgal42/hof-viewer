import {useCreatorCitiesViewsAndFavorites} from "./useCreatorCitiesViewsAndFavorites.ts";
import type {GroupedCities} from "../../../interfaces/City.ts";
import type {TrendsWorkerInput} from "../types/TrendsData.ts";
import {useTrendsWorker} from "./useTrendsWorker.ts";
import {combineAllCities} from "../../../utils/CombineAllCities.ts";

export const useCreatorTrends = (
  {creator, groupPeriod, enabled, trendType} : {
    creator: string,
    groupPeriod: number;
    enabled: boolean;
    trendType: string;
  }
) => {
  // TODO: Place the below on the component which uses this hook itself.
  //  This hook will then just take a City and do things from there
  const {
    data,
    isFetching,
    error,
    refetch,
  } = useCreatorCitiesViewsAndFavorites<GroupedCities | undefined>(
    creator, (trendsData) => combineAllCities(trendsData)
  );
  
  const workerInput: TrendsWorkerInput | null = data ? {
    createdAt: data.creator.createdAt,
    favorites: data.favorites,
    views: data.views
  } : null;
  
  const runWorker = Boolean(enabled && data && data.views && data.views.length > 0);
  
  const {data: viewsData, isProcessing: isViewsProcessing, progress: viewsProgress} =
    useTrendsWorker({
      data: workerInput,
      groupPeriod,
      trendType: "views",
      enabled: runWorker,
    });
  
  const {data: uniqueViewsData, isProcessing: isUniqueViewsProcessing, progress: uniqueViewsProgress} =
    useTrendsWorker({
      data: workerInput,
      groupPeriod,
      trendType: "uniqueViews",
      enabled: runWorker,
    });
  
  const {data: favoritesData, isProcessing: isFavoritesProcessing, progress: favoritesProgress} =
    useTrendsWorker({
      data: workerInput,
      groupPeriod,
      trendType: "favorites",
      enabled: runWorker,
    });
  
  const isProcessing = (isViewsProcessing && trendType === "views") ||
    (isUniqueViewsProcessing && trendType === "uniqueViews") ||
    (isFavoritesProcessing && trendType === "favorites");
  
  const trendsData = trendType === "favorites"
    ? favoritesData
    : trendType === "uniqueViews"
      ? uniqueViewsData
      : viewsData;
  
  const progress = trendType === "favorites"
    ? favoritesProgress
    : trendType === "uniqueViews"
      ? uniqueViewsProgress
      : viewsProgress;
  
  return {
    isProcessing,
    isFetching,
    progress,
    data,
    trendsData,
    error,
    requireManualFetch: Boolean(!data),
    refetch,
  }
}