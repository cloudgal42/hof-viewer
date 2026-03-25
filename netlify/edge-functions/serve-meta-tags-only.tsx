import type { Config, Context } from "@netlify/edge-functions";
import React from "https://esm.sh/react";
import { renderToReadableStream } from "https://esm.sh/react-dom/server";
import { HofErrorRes } from "../../src/interfaces/HofErrorRes.ts";
import { City } from "../../src/interfaces/City.ts";
import { groupCities } from "../../src/utils/GroupCities.ts";
import { FetchError } from "../../src/interfaces/FetchError.ts";

const EMBED_CRAWLER_LIST = [
  "Discordbot/",
  "Twitterbot/",
  "facebookexternalhit/",
];

async function fetchCity<T>(url: string): Promise<T> {
  console.time("Fetching data from HoF took");
  const fetchRes = await fetch(url);
  console.timeEnd("Fetching data from HoF took");
  if (!fetchRes.ok) {
    const data: HofErrorRes = await fetchRes.json();
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
      data = await fetchCity<City[]>(
        `https://halloffame.cs2.mtq.io/api/v1/screenshots?creatorId=${creator}`,
      );
    } else {
      console.log(
        `User-Agent: ${userAgent}, IP: ${context.ip} requesting for screenshot of ID ${cityId}`,
      );
      data = await fetchCity<City>(
        `https://halloffame.cs2.mtq.io/api/v1/screenshots/${cityId}`,
      );
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
        <meta property="og:site_name" content="Hall of Fame Viewer" />
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
