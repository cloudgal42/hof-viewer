import type { Config, Context } from "@netlify/edge-functions";
import React from "https://esm.sh/react";
import { renderToReadableStream } from "https://esm.sh/react-dom/server";
// import { HofErrorRes } from "../../src/interfaces/HofErrorRes.ts";
// import { City } from "../../src/interfaces/City.ts";
// import { groupCities } from "../../src/utils/GroupCities.ts";
// import { FetchError } from "../../src/interfaces/FetchError.ts";

class FetchError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "FetchError";

    Object.setPrototypeOf(this, FetchError.prototype);
  }
}

interface SocialPlatform {
  platform: string;
  link: string;
  clicks: number;
}

interface Creator {
  id: string;
  creatorName: string;
  creatorNameSlug: string;
  creatorNameLocale?: string;
  creatorNameLatinized?: string;
  creatorNameTranslated?: string;
  createdAt: string;
  socials: SocialPlatform[];
}

interface Mod {
  id: string;
  paradoxModId: number;
  name: string;
  authorName: string;
  shortDescription: string;
  thumbnailUrl: string;
  tags: string[];
  subscribersCount: number;
  knownLastUpdatedAt: string;
}

interface TotalScreenshotStats {
  combinedStats?: GroupedCities;
}

// Group all stats of each unique city name into one.
export function groupCities(citiesToGroup: City[]) {
  const groupedScreenshots: City[][] = [];
  const groupedCities: GroupedCities[] = [];

  // 1. Get all distinct city names. Use Set() to filter down to only unique values
  // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/Set
  const cityNames = citiesToGroup.map(({cityName}) => cityName.toLowerCase());
  const uniqueCityNames = [...new Set(cityNames)];

  // 2. Combine all unique city entries into 1 array
  uniqueCityNames.forEach(cityName => {
    const cityScreenshots = citiesToGroup.filter(city => city.cityName.toLowerCase() === cityName)
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
        imageUrl4K: (!screenshotStat.combinedStats?.imageUrl4K) ?
          [] : screenshotStat.combinedStats.imageUrl4K,
        imageUrlFHD: (!screenshotStat.combinedStats?.imageUrlFHD) ?
          [] : screenshotStat.combinedStats.imageUrlFHD,
        imageUrlThumbnail: (!screenshotStat.combinedStats?.imageUrlThumbnail) ?
          [] : screenshotStat.combinedStats.imageUrlThumbnail,
        mapName: screenshot.mapName,
        paradoxModIds: screenshot.paradoxModIds,
        shareParadoxModIds: screenshot.shareParadoxModIds,
        shareRenderSettings: screenshot.shareRenderSettings,
        __favorited: false,
        favorites: (!screenshotStat.combinedStats?.favorites) ?
          [] : screenshotStat.combinedStats.favorites,
        views: (!screenshotStat.combinedStats?.views) ?
          [] : screenshotStat.combinedStats.views,
        cities: (!screenshotStat.combinedStats?.cities) ?
          [] : screenshotStat.combinedStats.cities,
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

interface HofErrorRes {
  statusCode: number;
  message: string;
}

interface Views {
  id: string;
  viewedAt: string;
  creatorId: string;
  creator: Creator;
  screenshotId: string;
}

interface Favorites {
  id: string;
  favoritedAt: string;
  creatorId: string;
  creator: Creator;
  screenshotId: string;
}

interface City {
  id: string;
  isApproved: boolean;
  isReported: boolean;
  favoritesCount: number;
  favoritingPercentage: number;
  viewsCount: number;
  uniqueViewsCount: number;
  cityName: string;
  cityNameLocale?: string;
  cityNameLatinized?: string;
  cityNameTranslated?: string;
  cityMilestone: number;
  cityPopulation: number;
  mapName?: string;
  imageUrlThumbnail: string;
  imageUrlFHD: string;
  imageUrl4K: string;
  shareParadoxModIds: boolean;
  paradoxModIds: number[];
  shareRenderSettings: boolean;
  creatorId: string;
  creator: Creator;
  createdAt: string;
  createdAtFormatted?: string;
  createdAtFormattedDistance: string;
  description?: string;
  renderSettings: object; // TODO: Maybe define an interface for this?
  showcasedMod?: Mod;
  showcasedModId?: number;
  favorites?: Favorites[];
  views?: Views[];
  __favorited: boolean;
}

interface GroupedCities extends Omit<City, "imageUrlFHD" | "imageUrl4K" | "imageUrlThumbnail"> {
  imageUrlFHD: string[];
  imageUrl4K: string[];
  imageUrlThumbnail: string[];
  cities: City[];
}

const EMBED_CRAWLER_LIST = [
  "Discordbot/",
  "Twitterbot/",
  "facebookexternalhit/",
];

async function fetchCity(url: string) {
  console.time("Fetching data from HoF took");
  const fetchRes = await fetch(url);
  console.timeEnd("Fetching data from HoF took");
  if (!fetchRes.ok) {
    const data = await fetchRes.json() as HofErrorRes;
    throw new FetchError(data.message, fetchRes.status);
  } else {
    return await fetchRes.json();
  }
}

export default async function serveSkeletonPage(
  req: Request,
  context: Context,
) {
  const userAgent = req.headers.get("User-Agent");
  const isCrawler = EMBED_CRAWLER_LIST.some((crawler) => {
    if (!userAgent) return false;
    const testExp = new RegExp(crawler, "i");

    return testExp.test(userAgent);
  });

  // If request is not from the specified crawler list, send it the regular page
  if (!isCrawler) {
    console.log(
      `Request from ${userAgent} is not in the social media crawler list, skipping...`,
    );
    return context.next();
  }

  const searchParams = new URLSearchParams(
    new URL(req.url).search,
  );
  const isGroupedCities = searchParams.get("groupStatus") === "on";
  const creator = searchParams.get("creator");
  const { cityId } = context.params;

  let status;
  let data;
  let head;

  try {
    if (isGroupedCities) {
      console.log(
        `User-Agent: ${userAgent}, IP: ${context.ip} requesting for city name of ${cityId} by creator ${creator}`,
      );
      data = await fetchCity(
        `https://halloffame.cs2.mtq.io/api/v1/screenshots?creatorId=${creator}`,
      ) as City[];
    } else {
      console.log(
        `User-Agent: ${userAgent}, IP: ${context.ip} requesting for screenshot of ID ${cityId}`,
      );
      data = await fetchCity(
        `https://halloffame.cs2.mtq.io/api/v1/screenshots/${cityId}`,
      ) as City;
    }

    const city = (Array.isArray(data))
      ? groupCities(data).find((entry) =>
        entry.cityName.toLowerCase() === cityId.toLowerCase()
      )
      : data;

    if (city) {
      console.log(
        `SUCCESS: Found ${city.cityName} by creator ${city.creator.creatorName}`,
      );
      status = 200;
      const bestImageUrls = ("cities" in city)
        ? city.cities
          .sort((a, b) => b.favoritesCount - a.favoritesCount)
          .toSpliced(4)
          .map((entry) => entry.imageUrlFHD)
        : [city.imageUrlFHD];

      head = (
        <>
          <title>{`${city.cityName} - Hall of Fame Viewer`}</title>
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            property="twitter:description"
            content={`by ${city.creator.creatorName}\n\n👤 ${city.cityPopulation.toLocaleString()} ♥️ ${city.favoritesCount.toLocaleString()} 👁️ ${city.uniqueViewsCount.toLocaleString()}`}
          />
          <meta
            property="og:title"
            content={`${city.cityName} on Hall of Fame`}
          />
          <meta property="og:type" content="article" />
          <meta
            property="og:description"
            content={`by ${city.creator.creatorName}\n\n👤 ${city.cityPopulation.toLocaleString()} ♥️ ${city.favoritesCount.toLocaleString()} 👁️ ${city.uniqueViewsCount.toLocaleString()}`}
          />

          {bestImageUrls.map((url) => (
            <>
              <meta property="og:image" content={url} />
              <meta property="twitter:image" content={url} />
            </>
          ))}
          <meta property="article:published_time" content={city.createdAt} />
          <meta
            property="profile:username"
            content={city.creator.creatorName}
          />
          <meta property="og:url" content={req.url} />
        </>
      );
    } else {
      console.error(`Cannot find ${cityId} by ${creator}`);
      status = 404;
      head = (
        <>
          <title>Hall of Fame Viewer</title>
          <meta property="og:title" content="Hall of Fame Viewer" />
          <meta
            property="og:description"
            content={`Failed to get city info due to Could not find ${cityId} by ${creator} :(`}
          />
          <meta
            property="twitter:description"
            content={`Failed to get city info due to Could not find ${cityId} by ${creator} :(`}
          />

          <meta property="og:url" content={req.url} />
        </>
      );
    }
  } catch (e) {
    if (e instanceof FetchError) {
      console.error("Failed to fetch data from HoF due to", e.message);
      status = e.status;
      head = (
        <>
          <title>Hall of Fame Viewer</title>
          <meta property="og:title" content="Hall of Fame Viewer" />
          <meta
            property="og:description"
            content={`Failed to get city info due to ${e.message} :(`}
          />
          <meta
            property="twitter:description"
            content={`Failed to get city info due to ${e.message} :(`}
          />

          <meta property="og:url" content={req.url} />
        </>
      );
    } else {
      console.error("Something else went wrong while running this function", e);
      status = 500;
      head = (
        <>
          <title>Hall of Fame Viewer</title>
          <meta property="og:title" content="Hall of Fame Viewer" />
          <meta
            property="og:description"
            content="An unexpected error happened :("
          />
          <meta
            property="twitter:description"
            content="An unexpected error happened :("
          />

          <meta property="og:url" content={req.url} />
        </>
      );
    }
  }

  const stream = await renderToReadableStream(
    <html lang="en">
      <head>
        {head}
      </head>
      <body>
        <h1>Hall of Fame Viewer</h1>
      </body>
    </html>,
  );

  // (Temp?) Fixes repeated function calls due to Netlify's way of handling 404
  return new Response(stream, {
    status: status === 404 ? 200 : status,
    headers: {
      "Content-Type": "text/html",
    },
  });
}

export const config: Config = {
  path: "/city/:cityId",
};
