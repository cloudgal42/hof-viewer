import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend, type ChartEvent, type ChartType,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';
import type {City, GroupedCities} from "../../../interfaces/City.ts";
import {useMemo, useRef, useState} from "react";
import {getRelativePosition} from "chart.js/helpers";
import {ClickedCityCard} from "./ClickedCityCard.tsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StackedChartProps {
  city: GroupedCities;
  type: "views" | "favorites";
}

function getRandomColor() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);

  return `rgb(${r}, ${g}, ${b})`;
}

export const StackedChart = ({city, type}: StackedChartProps) => {
  const chartRef = useRef<ChartJS<"bar">>(null);
  const [clickedCity, setClickedCity] = useState<City>();

  const totalStats = (type === "favorites") ? city.favoritesCount : city.viewsCount
  const stats = useMemo(() => {
    if (type === "favorites") {
      return city.cities.map((entry, i) => {
        return {
          id: entry.id,
          label: `Screenshot ${new Date(entry.createdAt).toLocaleString()})`,
          data: [100 * (entry.favoritesCount / totalStats)],
          backgroundColor: getRandomColor(),
          details: entry,
        }
      })
    } else {
      return city.cities.map((entry, i) => {
        return {
          id: entry.id,
          label: `Screenshot ${new Date(entry.createdAt).toLocaleString()})`,
          data: [100 * (entry.viewsCount / totalStats)],
          backgroundColor: getRandomColor(),
          details: entry,
        }
      })
    }
  }, [city.cities, totalStats, type]);

  const options = {
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false,
      }
    },
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          display: false,

        },
        max: 100,
        stacked: true,
        display: false,
      },
      y: {
        ticks: {
          display: false,
        },
        stacked: true,
      },
    },
    onClick: (e: ChartEvent) => {
      const chart = chartRef.current;
      if (!chart) return;

      // @ts-expect-error because Mismatched event types, FIXME
      const points = chart.getElementsAtEventForMode(e, "nearest", {intersect: true}, true);
      setClickedCity(stats[points[0].datasetIndex].details);
    },
  };

  const data = {
    labels: [""],
    datasets: stats,
  };

  return (
    <>
      <div className="w-100" style={{height: "64px"}}>
        <Bar ref={chartRef} options={options} data={data}/>
      </div>
      <p className="mb-2 text-muted">Hover to see % value, Click to see screenshot details.</p>
      {clickedCity && (
        <ClickedCityCard key={clickedCity.id} city={clickedCity} />
      )}
    </>
  )
}