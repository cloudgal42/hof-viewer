import type {Context} from "@netlify/edge-functions";
import React from "https://esm.sh/react";
import { renderToReadableStream } from "https://esm.sh/react-dom/server";
import {HofError} from "../../src/interfaces/HofError.ts";
import {City, GroupedCities} from "../../src/interfaces/City.ts";
import {groupCities} from "../../src/utils/GroupCities.ts";

const EMBED_CRAWLER_LIST = [
  "Discordbot/",
  "Twitterbot/",
  "facebookexternalhit/"
]

export default async function serveSkeletonPage(
  req: Request,
  context: Context
) {
  const userAgent = req.headers.get("User-Agent");
  const isCrawler = EMBED_CRAWLER_LIST.some(crawler => {
    if (!userAgent) return false;
    const testExp = new RegExp(crawler, "i");

    return testExp.test(userAgent);
  });

  if (!isCrawler) return context.next();

  const searchParams = new URLSearchParams(
    new URL(req.url).search
  );
  const isGroupedCities = searchParams.get("groupStatus") === "on";
  let data;

  const {cityId} = context.params;

  // FIXME: Use prod server link
  if (isGroupedCities) {
    const creator = searchParams.get("creator");
    const fetchRes = await fetch(`https://test.halloffame.cs2.mtq.io/api/v1/screenshots?creatorId=${creator}`);
    data = await fetchRes.json() as City[] | HofError;
  } else {
    const fetchRes = await fetch(`https://test.halloffame.cs2.mtq.io/api/v1/screenshots/${cityId}`);
    data = await fetchRes.json() as City | HofError;
  }

  const city: City | GroupedCities | undefined = ("cityName" in data || Array.isArray(data))
    ? (Array.isArray(data))
      ? groupCities(data).find(entry => entry.cityName.toLowerCase() === cityId.toLowerCase())
      : data
    : undefined;

  console.log(city)

  let head;
  if (city) {
    const bestImageUrls = ("cities" in city) ?
      city.cities
        .sort((a, b) => b.favoritesCount - a.favoritesCount)
        .toSpliced(4)
        .map(entry => entry.imageUrlFHD)
      : [city.imageUrlFHD];
    
    head = (
      <>
        <title>{`${city.cityName} - Hall of Fame Viewer`}</title>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta
          property="twitter:description"
          content={`by ${city.creator.creatorName}\n\n👤 ${city.cityPopulation.toLocaleString()} ♥️ ${city.favoritesCount.toLocaleString()} 👁️ ${city.uniqueViewsCount.toLocaleString()}`}/>
        <meta property="og:title" content={`${city.cityName} on Hall of Fame`}/>
        <meta property="og:type" content="article"/>
        <meta
          property="og:description"
          content={`by ${city.creator.creatorName}\n\n👤 ${city.cityPopulation.toLocaleString()} ♥️ ${city.favoritesCount.toLocaleString()} 👁️ ${city.uniqueViewsCount.toLocaleString()}`}/>

        {bestImageUrls.map(url => (
          <>
            <meta property="og:image" content={url}/>
            <meta property="twitter:image" content={url}/>
          </>
        ))}
        <meta property="article:published_time" content={city.createdAt}/>
        <meta property="profile:username" content={city.creator.creatorName}/>
        <meta property="og:url" content={req.url}/>
      </>)
  }

  const stream = await renderToReadableStream(
    <html lang="en">
    <head>
      {head}
    </head>
    <body>
      <h1>Test</h1>
    </body>
    </html>
  );

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
    }
  });
}

export const config = {
  path: "/city/:cityId"
}