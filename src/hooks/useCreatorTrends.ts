import {useCreatorCitiesViewsAndFavorites} from "./useCreatorCitiesViewsAndFavorites.ts";
import type {GroupedCities} from "../interfaces/City.ts";
import type {GroupedCityRowSetting} from "../interfaces/GroupedCityRowSetting.ts";
import {groupCities} from "../utils/GroupCities.ts";
import type {TrendsWorkerInput} from "../interfaces/TrendsData.ts";
import {useTrendsWorker} from "./useTrendsWorker.ts";
import {useEffect} from "react";

export const useCreatorTrends = (
  {creator, groupPeriod, enabled, trendType} : {
    creator: string,
    groupPeriod: number;
    enabled: boolean;
    trendType: string;
  }
) => {
  const {
    data,
    isFetching,
    error,
    refetch,
  } = useCreatorCitiesViewsAndFavorites<GroupedCities | undefined>(
    creator, (trendsData) => {
      const customSetting: GroupedCityRowSetting = {
        groupCandidates: [...new Set(trendsData.map(city => city.cityName))].map(entry => ({
          name: entry,
          isEditable: false,
          id: entry
        })),
        groupedCityName: "All",
        id: "All",
        isModified: false,
        isUserCreated: false
      }
      
      return groupCities(trendsData, [customSetting])[0];
    }
  );
  
  const workerInput: TrendsWorkerInput | null = data ? {
    createdAt: data.creator.createdAt,
    favorites: data.favorites,
    views: data.views
  } : null;
  
  const runWorker = Boolean(enabled && data && data.views && data.views.length > 0);
  
  const {data: viewsData, isProcessing: isViewsProcessing} =
    useTrendsWorker({
      data: workerInput,
      groupPeriod,
      trendType: "views",
      enabled: runWorker,
    });
  
  const {data: uniqueViewsData, isProcessing: isUniqueViewsProcessing} =
    useTrendsWorker({
      data: workerInput,
      groupPeriod,
      trendType: "uniqueViews",
      enabled: runWorker,
    });
  
  const {data: favoritesData, isProcessing: isFavoritesProcessing} =
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
  
  return {
    isProcessing,
    isFetching,
    data,
    trendsData,
    error,
    requireManualFetch: Boolean(!data),
    refetch,
  }
}