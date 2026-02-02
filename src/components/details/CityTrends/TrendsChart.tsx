import type {City, GroupedCities} from "../../../interfaces/City.ts";
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
import * as React from "react";
import type {TrendsData, WorkerParams} from "../../../interfaces/TrendsData.ts";
import {useEffect, useRef, useState} from "react";

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

const TrendsChart = React.memo(({city, trendType, groupPeriod}: TrendsChartProps) => {
  const [groupedCounts, setGroupedCounts] = useState<TrendsData>({});
  const chartName = `${getFormattedTrendType(trendType)} per ${groupPeriod} day(s)`;

  const workerRef = useRef<Worker>(null);

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
          "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div className="bg-white position-relative" style={{minHeight: "50vh"}}>
      <Bar data={data} options={options}/>
    </div>
  )
})

export default TrendsChart;