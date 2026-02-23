import type {City, GroupedCities} from "../../../interfaces/City.ts";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend, defaults,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';
import * as React from "react";
import type {TrendsData, WorkerParams} from "../../../interfaces/TrendsData.ts";
import {useContext, useEffect, useRef, useState} from "react";
import {ThemeContext} from "../../../context/ThemeContext.ts";

interface TrendsChartProps {
  city: City | GroupedCities;
  trendType: string;
  groupPeriod: number;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

defaults.font.family = "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\"," +
  " \"Noto Sans\", \"Liberation Sans\", Arial, sans-serif, \"Apple Color Emoji\", " +
  "\"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\""

const TrendsChart = React.memo(({city, trendType, groupPeriod}: TrendsChartProps) => {
  const [groupedCounts, setGroupedCounts] = useState<TrendsData>({});
  const chartName = `${getFormattedTrendType(trendType)} per ${groupPeriod} day(s)`;

  const workerRef = useRef<Worker>(null);
  const theme = useContext(ThemeContext);

  const fontColor = theme === "dark" ? "#fff" : "gray";
  const gridColor = theme === "dark" ? {color: "#3a3a3a"} : {};

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../../../workers/TrendsWorker.ts", import.meta.url), {
        type: "module",
      }
    );
    const params: WorkerParams = {
      city,
      day: groupPeriod,
      type: trendType,
    }

    workerRef.current.postMessage(params);

    workerRef.current.onmessage = (e) => {
      setGroupedCounts(e.data);
    }

    return () => {
      if (workerRef.current) workerRef.current.terminate();
    }
  }, [city, trendType, groupPeriod]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: fontColor,
        }
      },
      title: {
        display: true,
        text: chartName,
        color: fontColor,
      },
    },
    scales: {
      x: {
        ticks: {color: fontColor},
        grid: {...gridColor,}
      },
      y: {
        ticks: {color: fontColor},
        grid: {...gridColor,}
      }
    }
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
          "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div className="position-relative" style={{minHeight: "50vh"}}>
      <Bar data={data} options={options}/>
    </div>
  )
})

export default TrendsChart;