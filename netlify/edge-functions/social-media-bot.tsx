import type { Context } from "@netlify/edge-functions";
import React from "https://esm.sh/react";
import { renderToReadableStream } from "https://esm.sh/react-dom/server";
import { HofErrorRes } from "../../src/interfaces/HofErrorRes.ts";
import { City } from "../../src/interfaces/City.ts";
import { groupCities } from "../../src/utils/GroupCities.ts";

const EMBED_CRAWLER_LIST = [
  "Discordbot/",
  "Twitterbot/",
  "facebookexternalhit/",
];

async function fetchCity(url: string) {
  const fetchRes = await fetch(url);

  if (!fetchRes.ok) {
    const data = await fetchRes.json() as HofErrorRes;
    throw new Error(`${fetchRes.status}: ${data.message}`);
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
  if (!isCrawler) return context.next();

  const searchParams = new URLSearchParams(
    new URL(req.url).search,
  );
  const isGroupedCities = searchParams.get("groupStatus") === "on";
  const { cityId } = context.params;

  let data;
  let head;

  // FIXME: Use prod server link
  try {
    if (isGroupedCities) {
      const creator = searchParams.get("creator");
      data = await fetchCity(
        `https://test.halloffame.cs2.mtq.io/api/v1/screenshots?creatorId=${creator}`,
      ) as City[];
    } else {
      data = await fetchCity(
        `https://test.halloffame.cs2.mtq.io/api/v1/screenshots/${cityId}`,
      ) as City;
    }

    const city = (Array.isArray(data))
      ? groupCities(data).find((entry) =>
        entry.cityName.toLowerCase() === cityId.toLowerCase()
      )
      : data;

    if (city) {
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
    }
  } catch (e) {
    if (e instanceof Error) {
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
    }
  }

  const stream = await renderToReadableStream(
    <html lang="en">
      <head>
        {head}
      </head>
      <body>
        <h1>Test</h1>
      </body>
    </html>,
  );

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
    },
  });
}

export const config = {
  path: "/city/:cityId",
};
