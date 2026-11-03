import type { City, GroupedCities } from "../../../interfaces/City.ts";
import { useTrendsWorker } from "./useTrendsWorker.ts";
import { useCreatorCitiesViewsAndFavorites } from "./useCreatorCitiesViewsAndFavorites.ts";
import type { TrendsWorkerInput } from "../types/TrendsData.ts";
import { useGroupedCities } from "../../../hooks/useGroupedCities.ts";

export const useCityTrends = (
  { creator, city, groupPeriod, enabled, trendType }: {
    creator: string;
    city: City | GroupedCities;
    groupPeriod: number;
    enabled: boolean;
    trendType: string;
  },
) => {
  // TODO: Place the 2 below code on the component which uses this hook itself.
  //  This hook will then just take a City and do things from there
  const { groupCities } = useGroupedCities(creator);

  const { data, isFetching, error, refetch } =
    useCreatorCitiesViewsAndFavorites<GroupedCities | undefined>(
      creator,
      (trendsData) =>
        groupCities(trendsData)
          .find((entry) => entry.cityName === city.cityName),
    );

  // This is used for trends graph.
  // Only use data from useCreatorTrends if viewing a grouped city.
  const cityWithTrends = data &&
      Array.isArray(city.imageUrlFHD)
    ? data
    : city;

  const runWorker = Boolean(
    enabled && cityWithTrends.views && cityWithTrends.views.length > 0,
  );

  const workerInput: TrendsWorkerInput | null = cityWithTrends
    ? {
      createdAt: cityWithTrends.createdAt,
      favorites: cityWithTrends.favorites,
      views: cityWithTrends.views,
    }
    : null;

  const {
    data: viewsData,
    isProcessing: isViewsProcessing,
    progress: viewsProgress,
    error: viewsError,
  } = useTrendsWorker({
    data: workerInput,
    groupPeriod,
    trendType: "views",
    enabled: runWorker,
  });

  const {
    data: uniqueViewsData,
    isProcessing: isUniqueViewsProcessing,
    progress: uniqueViewsProgress,
    error: uniqueViewsError,
  } = useTrendsWorker({
    data: workerInput,
    groupPeriod,
    trendType: "uniqueViews",
    enabled: runWorker,
  });

  const {
    data: favoritesData,
    isProcessing: isFavoritesProcessing,
    progress: favoritesProgress,
    error: favoritesError,
  } = useTrendsWorker({
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

  const isTrendsStale = (cityWithTrends?.views &&
    cityWithTrends.views.length !== city?.viewsCount) ||
    (cityWithTrends?.favorites &&
      cityWithTrends?.favorites.length !== city?.favoritesCount);

  const requireManualFetch = Array.isArray(city.imageUrlFHD) && !data;

  return {
    trendsData,
    isProcessing,
    isFetching,
    progress,
    error,
    workerError: viewsError ?? uniqueViewsError ?? favoritesError,
    refetch,
    isTrendsStale,
    requireManualFetch,
  };
};
