import {useGroupedCitiesSettings} from "./useGroupedCitiesSettings.ts";
import {useGroupedCitiesGenSettings} from "./useGroupedCitiesGenSettings.ts";
import type {City, GroupedCities} from "../interfaces/City.ts";
import {groupCities} from "../utils/GroupCities.ts";
import {useCityTrendsWorker} from "./useCityTrendsWorker.ts";
import {useCreatorCitiesViewsAndFavorites} from "./useCreatorCitiesViewsAndFavorites.ts";

export const useCityTrends = (
  {creator, city, groupPeriod, enabled, trendType}:
  {
    creator: string;
    city: City | GroupedCities;
    groupPeriod: number;
    enabled: boolean;
    trendType: string;
  }
) => {
  const {groupedCitiesRows} = useGroupedCitiesSettings(creator);
  const [groupedCitiesGenSettings] = useGroupedCitiesGenSettings();

  const groupedSettings = groupedCitiesGenSettings.useDefault ? undefined : groupedCitiesRows.get(creator);

  const {data, isFetching, error, refetch} = useCreatorCitiesViewsAndFavorites<GroupedCities | undefined>(
    creator,
    (trendsData) =>
      groupCities(trendsData, groupedSettings)
        .find(entry => entry.cityName === city.cityName),
  )

  // This is used for trends graph.
  // Only use data from useCreatorTrends if viewing a grouped city.
  const cityWithTrends = data &&
  Array.isArray(city.imageUrlFHD)
    ? data
    : city;

  const runWorker = Boolean(enabled && cityWithTrends.views && cityWithTrends.views.length > 0);

  const {data: viewsData, isProcessing: isViewsProcessing} =
    useCityTrendsWorker({
      city: cityWithTrends ?? null,
      groupPeriod,
      trendType: "views",
      enabled: runWorker,
    });

  const {data: uniqueViewsData, isProcessing: isUniqueViewsProcessing} =
    useCityTrendsWorker({
      city: cityWithTrends ?? null,
      groupPeriod,
      trendType: "uniqueViews",
      enabled: runWorker,
    });

  const {data: favoritesData, isProcessing: isFavoritesProcessing} =
    useCityTrendsWorker({
      city: cityWithTrends ?? null,
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

  const isTrendsStale = (cityWithTrends?.views &&
      cityWithTrends.views.length !== city?.viewsCount) ||
    (cityWithTrends?.favorites &&
      cityWithTrends?.favorites.length !== city?.favoritesCount);

  const requireManualFetch = Array.isArray(city.imageUrlFHD) && !data;

  return {
    trendsData,
    isProcessing,
    isFetching,
    error,
    refetch,
    isTrendsStale,
    requireManualFetch,
  }
}