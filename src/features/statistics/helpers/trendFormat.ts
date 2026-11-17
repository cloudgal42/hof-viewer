import type {GroupPeriod} from "../types/TrendsData.ts";

export function getFormattedTrendType(trend: string) {
  switch (trend) {
    case "views":
      return "Views";
    case "favorites":
      return "Favorites";
    case "uniqueViews":
      return "Unique Views";
  }
}

export function formatDatesLabel(start: Date, period: GroupPeriod) {
  let options: Intl.DateTimeFormatOptions = {};
  
  if (period === "day" || period === "week") {
    options = {
      day: "numeric",
      month: "numeric",
      year: "2-digit",
    }
  } else if (period !== "year") {
    options = {
      month: "numeric",
      year: "numeric",
    }
  } else {
    options = {
      year: "numeric",
    }
  }
  
  return `${start.toLocaleString(navigator.language, options)}`
}

// export function formatChartLabels(entries: TrendsData | null, period: number) {
//   if (!entries) return [""];
//
//   return Object.keys(entries).map(key => {
//     return formatDatesLabel(new Date(Number(key)), period);
//   });
// }
//
// export function formatChartEntries(entries: TrendsData | null, period: number): TrendsData {
//   if (!entries) return {}
//
//   return Object.fromEntries(Object.entries(entries).map(([k, v]) =>
//     [formatDatesLabel(new Date(Number(k)), period), v]
//   ));
// }
