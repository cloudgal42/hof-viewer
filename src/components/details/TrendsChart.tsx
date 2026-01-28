import type {City, GroupedCities} from "../../interfaces/City.ts";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';

interface TrendsChartProps {
  city: City | GroupedCities;
  trendType: string;
  groupPeriod: number;
}

interface TrendsData {
  [key: string]: number;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DAYS_IN_MILLISECONDS = 86400000;

function getFormattedTrendType(trend: string) {
  switch (trend) {
    case "views":
      return "Views";
    case "favorites":
      return "Favorites";
    case "uniqueViews":
      return "Unique Views";
  }
}

function isLastDayOfYear(date: Date) {
  // + 1 on getMonth bc months in JS Date is 0 index based
  return `${date.getDate()}-${date.getMonth() + 1}` === `31-12`;
}

function isFirstDayOfYear(date: Date) {
  return `${date.getDate()}-${date.getMonth() + 1}` === `1-1`;
}

function formatDatesLabel(start: Date, end: Date, period: number) {
  let options: Intl.DateTimeFormatOptions = {};

  if (period < 30) {
    options = {
      day: "numeric",
      month: "numeric",
    }
  } else if (period < 365) {
    options = {
      month: "numeric",
      year: "numeric",
    }
  } else {
    options = {
      year: "numeric",
    }
  }

  if (isLastDayOfYear(start) || isFirstDayOfYear(start)
    || isLastDayOfYear(end) || isFirstDayOfYear(end)) {
    options = {
      ...options,
      year: "numeric",
    }
  }

  return period === 1 ?
    `${start.toLocaleString(navigator.language, options)}`
    : `${start.toLocaleString(navigator.language, options)} - ${end.toLocaleString("en-US", options)}`
}

function groupDates(start: Date, end: Date, period: number) {
  const startEpoch = start.getTime();
  const endEpoch = end.getTime();

  let currEpoch = startEpoch;
  const groupedDates = [];

  while (currEpoch < endEpoch) {
    const startRange = new Date(currEpoch);
    currEpoch += period * DAYS_IN_MILLISECONDS;
    const endRange = (currEpoch > endEpoch) ? new Date(endEpoch) : new Date(currEpoch);

    groupedDates.push([startRange, endRange]);
  }

  return groupedDates;
}

function groupData(city: City | GroupedCities, day: number, type: string): TrendsData | [] {
  // 1. Get the current date and the date posted in ms since the UNIX epoch
  const currDate = new Date();
  const datePosted = new Date(city.createdAt);
  // FIXME: Implement better undefined check
  if (!city.views && !city.favorites) return [];

  // 1.5. TODO: Define viewEntries array and assign it based on type for unique and non-unique views
  // const viewEntries = (type === "uniqueViews")

  // 2. Get grouped dates. groupedDates contain arrays of Date object with a length of 2
  // Index 0 is start, Index 1 is end
  const groupedDates = groupDates(datePosted, currDate, day);
  // console.log(groupedDates);

  // 3. Loop through groupedDates. Within this array, loop through the views/favorites entries
  const groupedData = groupedDates.map(range => {

    const startRange = range[0].getTime();
    const endRange = range[1].getTime();

    // There is already an undefined check above, so we can assert that city.views
    // is never undefined
    let rangeCount;

    if (type === "views") {
      rangeCount = city.views!.filter(entry => {
        const viewEpoch = new Date(entry.viewedAt).getTime();
        return viewEpoch > startRange && viewEpoch < endRange;
      }).length
    } else if (type === "favorites") {
      rangeCount = city.favorites!.filter(entry => {
        const viewEpoch = new Date(entry.favoritedAt).getTime();
        return viewEpoch > startRange && viewEpoch < endRange;
      }).length
    }

    return [formatDatesLabel(range[0], range[1], day), rangeCount];
  });
  return Object.fromEntries(groupedData);
}

export const TrendsChart = ({city, trendType, groupPeriod}: TrendsChartProps) => {
  const groupedCounts = groupData(city, groupPeriod, trendType);
  const chartName = `${getFormattedTrendType(trendType)} per ${groupPeriod} day(s)`;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: chartName,
      },
    },
  };

  const labels = Object.keys(groupedCounts);

  const data = {
    labels,
    datasets: [
      {
        label: chartName,
        data: Object.values(groupedCounts),
        backgroundColor: (trendType === "favorites") ?
          "rgba(255, 99, 132, 0.5)" :
          "rgba(53, 162, 235, 0.5",
      },
    ],
  };

  return (
    <Bar data={data} options={options}/>
  )
}