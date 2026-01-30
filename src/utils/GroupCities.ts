
import type {City, GroupedCities} from "../interfaces/City.ts";

interface TotalScreenshotStats {
  combinedStats?: GroupedCities;
}

// Group all stats of each unique city name into one.
export function groupCities(citiesToGroup: City[]) {
  const groupedScreenshots: City[][] = [];
  const groupedCities: GroupedCities[] = [];

  // 1. Get all distinct city names. Use Set() to filter down to only unique values
  // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/Set
  const cityNames = citiesToGroup.map(({cityName}) => cityName);
  const uniqueCityNames = [...new Set(cityNames)];

  // 2. Combine all unique city entries into 1 array
  uniqueCityNames.forEach(cityName => {
    const cityScreenshots = citiesToGroup.filter(city => city.cityName === cityName)
    groupedScreenshots.push(cityScreenshots);
  });

  // 3. Iterate through groupedScreenshots[], and push the new data into groupedCities[]
  groupedScreenshots.forEach(screenshotArr => {
    const screenshotStat: TotalScreenshotStats = {};
    screenshotArr.forEach(screenshot => {
      screenshotStat.combinedStats = {
        id: screenshot.id,
        isApproved: screenshot.isApproved,
        isReported: screenshot.isReported,
        favoritesCount: (!screenshotStat.combinedStats?.favoritesCount) ? screenshot.favoritesCount : screenshotStat.combinedStats.favoritesCount + screenshot.favoritesCount,
        favoritingPercentage: 0, // FIXME
        viewsCount: (!screenshotStat.combinedStats?.viewsCount) ? screenshot.viewsCount : screenshotStat.combinedStats.viewsCount + screenshot.viewsCount,
        uniqueViewsCount: (!screenshotStat.combinedStats?.uniqueViewsCount) ? screenshot.uniqueViewsCount : screenshotStat.combinedStats.uniqueViewsCount + screenshot.uniqueViewsCount,
        cityName: screenshot.cityName,
        cityNameLatinized: screenshot.cityNameLatinized,
        cityNameLocale: screenshot.cityNameLocale,
        cityNameTranslated: screenshot.cityNameTranslated,
        cityMilestone: screenshot.cityMilestone,
        cityPopulation: screenshot.cityPopulation,
        renderSettings: screenshot.renderSettings,
        createdAt: screenshotArr[0].createdAt,
        createdAtFormatted: screenshotArr[0].createdAtFormatted,
        createdAtFormattedDistance: screenshotArr[0].createdAtFormattedDistance,
        creator: screenshot.creator,
        creatorId: screenshot.creatorId,
        imageUrl4K: (!screenshotStat.combinedStats?.imageUrl4K) ? [] : screenshotStat.combinedStats.imageUrl4K,
        imageUrlFHD: (!screenshotStat.combinedStats?.imageUrlFHD) ? [] : screenshotStat.combinedStats.imageUrlFHD,
        imageUrlThumbnail: (!screenshotStat.combinedStats?.imageUrlThumbnail) ? [] : screenshotStat.combinedStats.imageUrlThumbnail,
        mapName: screenshot.mapName,
        paradoxModIds: screenshot.paradoxModIds,
        shareParadoxModIds: screenshot.shareParadoxModIds,
        shareRenderSettings: screenshot.shareRenderSettings,
        __favorited: false,
        favorites: (!screenshotStat.combinedStats?.favorites) ? [] : screenshotStat.combinedStats.favorites,
        views: (!screenshotStat.combinedStats?.views) ? [] : screenshotStat.combinedStats.views,
        cities: (!screenshotStat.combinedStats?.cities) ? [] : screenshotStat.combinedStats.cities,
      }

      screenshotStat.combinedStats?.cities.push(screenshot);
      screenshotStat.combinedStats?.imageUrlFHD.push(screenshot.imageUrlFHD);
      screenshotStat.combinedStats?.imageUrl4K.push(screenshot.imageUrl4K);
      screenshotStat.combinedStats?.imageUrlThumbnail.push(screenshot.imageUrlThumbnail);

      if (screenshotStat.combinedStats?.favorites && screenshot.favorites) {
        screenshotStat.combinedStats?.favorites.push(...screenshot.favorites);
      }
      if (screenshotStat.combinedStats?.views && screenshot.views) {
        screenshotStat.combinedStats?.views.push(...screenshot.views);
      }
    });

    if (screenshotStat.combinedStats) {
      screenshotStat.combinedStats.favoritingPercentage = Math.round((screenshotStat.combinedStats.favoritesCount / screenshotStat.combinedStats.uniqueViewsCount) * 100);
      groupedCities.push(screenshotStat.combinedStats);
    }
  });
  // 4. Return the grouped cities
  return groupedCities;
}