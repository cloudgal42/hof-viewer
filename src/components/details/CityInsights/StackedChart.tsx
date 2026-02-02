import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend, type ChartEvent,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';
import type {GroupedCities} from "../../../interfaces/City.ts";
import {useMemo, useRef, useState} from "react";
import {ClickedCityCard} from "./ClickedCityCard.tsx";
import zoomPlugin from 'chartjs-plugin-zoom';
import {Button} from "react-bootstrap";

import "../../../css/components/StackedChart.scss";
import {ZoomIn, ZoomOut} from "react-bootstrap-icons";
import type {PercentageStat} from "../../../interfaces/PercentageStat.ts";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin,
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
  const [clickedBar, setClickedBar] = useState<PercentageStat>();

  const totalStats = (type === "favorites") ? city.favoritesCount : city.viewsCount
  const stats: PercentageStat[] = useMemo(() => {
    if (type === "favorites") {
      return city.cities
        .sort((a, b) => b.favoritesCount - a.favoritesCount)
        .map((entry) => {
        return {
          id: entry.id,
          label: `Screenshot ${new Date(entry.createdAt).toLocaleString()})`,
          data: [100 * (entry.favoritesCount / totalStats)],
          backgroundColor: getRandomColor(),
          details: entry,
        }
      })
    } else {
      return city.cities
        .sort((a, b) => b.viewsCount - a.viewsCount)
        .map((entry) => {
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

  // options is memonized to prevent zoom level being reset whenever user clicks on the graph
  const options = useMemo(() => ({
    plugins: {
      title: {display: false},
      legend: {display: false},
      zoom: {
        zoom: {
          wheel: {enabled: true},
          pinch: {enabled: true},
          limits: {
            y: {min: "original", max: "original"},
          },
          mode: 'x' as const,
        },
        pan: {
          enabled: true,
          mode: 'x' as const,
        },
      },
    },
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {display: false},
        max: 100,
        stacked: true,
        display: false,
      },
      y: {
        ticks: {display: false},
        stacked: true,
      },
    },
    onClick: (e: ChartEvent) => {
      const chart = chartRef.current;
      if (!chart) return;

      // @ts-expect-error because Mismatched event types, FIXME
      const points = chart.getElementsAtEventForMode(e, "nearest", {intersect: true}, true);
      setClickedBar(stats[points[0].datasetIndex]);
    },
  }), [stats])

  const data = {
    labels: [""],
    datasets: stats,
  };

  function handleZoom(value: number) {
    const chart = chartRef.current;

    if (chart) {
      chart.zoom(1 + value, "zoom");
    }
  }

  return (
    <>
      <section className="w-100 chart-container">
        <Bar ref={chartRef} options={options} data={data}/>
      </section>
      <section className="mb-3">
        <p className="mb-2 text-muted">
          Hover to see % value, Click to see screenshot details. Drag to pan.
        </p>
        <div className="d-flex gap-2">
          <Button
            variant="outline-primary"
            onClick={() => {
              const chart = chartRef.current;
              if (chart) chart.resetZoom();
            }}
          >
            Reset zoom
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => handleZoom(0.25)}
            className="d-flex align-items-center justify-content-center"
          >
            <span className="visually-hidden">Zoom In</span>
            <ZoomIn />
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => handleZoom(-0.25)}
            className="d-flex align-items-center justify-content-center"
          >
            <span className="visually-hidden">Zoom Out</span>
            <ZoomOut />
          </Button>
        </div>
      </section>
      <section>
        {clickedBar && (
          <ClickedCityCard key={clickedBar.id} data={clickedBar}/>
        )}
      </section>
    </>
  )
}