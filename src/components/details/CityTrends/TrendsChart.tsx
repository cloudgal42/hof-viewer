import type { City, GroupedCities } from "../../../interfaces/City.ts";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  defaults,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import * as React from "react";
import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext.ts";

import "../../../css/components/TrendsChart.css";
import { Spinner } from "react-bootstrap";
import { useCityTrendsWorker } from "../../../hooks/useCityTrendsWorker.ts";

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
  Legend,
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

defaults.font.family =
  'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",' +
  ' "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", ' +
  '"Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

const TrendsChart = React.memo(
  ({ city, trendType, groupPeriod }: TrendsChartProps) => {
    const chartName = `${
      getFormattedTrendType(trendType)
    } per ${groupPeriod} day(s)`;

    const theme = useContext(ThemeContext);

    const fontColor = theme === "dark" ? "#fff" : "#222";
    const gridColor = theme === "dark" ? { color: "#3a3a3a" } : {};

    const { data: viewsData, isProcessing: isViewsProcessing } =
      useCityTrendsWorker({
        city,
        groupPeriod,
        trendType: "views",
      });

    const { data: uniqueViewsData, isProcessing: isUniqueViewsProcessing } =
      useCityTrendsWorker({
        city,
        groupPeriod,
        trendType: "uniqueViews",
      });

    const { data: favoritesData, isProcessing: isFavoritesProcessing } =
      useCityTrendsWorker({
        city,
        groupPeriod,
        trendType: "favorites",
      });

    const isProcessing = (isViewsProcessing && trendType === "views")
      || (isUniqueViewsProcessing && trendType === "uniqueViews")
      || (isFavoritesProcessing && trendType === "favorites");

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            color: fontColor,
          },
        },
        title: {
          display: true,
          text: chartName,
          color: fontColor,
        },
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
              modifierKey: "ctrl" as const,
            },
            pinch: { enabled: true },
            limits: {
              y: { min: "original", max: "original" },
            },
            mode: "x" as const,
          },
          pan: {
            enabled: true,
            mode: "x" as const,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: fontColor },
          grid: { ...gridColor },
        },
        y: {
          ticks: { color: fontColor },
          grid: { ...gridColor },
        },
      },
    };

    const labels = Object.keys(viewsData);

    const data = {
      labels,
      datasets: [
        {
          label: chartName,
          data: trendType === "favorites"
            ? favoritesData
            : trendType === "uniqueViews"
            ? uniqueViewsData
            : viewsData,
          backgroundColor: (trendType === "favorites")
            ? "rgba(255, 99, 132, 0.5)"
            : "rgba(53, 162, 235, 0.5)",
        },
      ],
    };

    return (
      <div className="position-relative">
        <div
          className={`spinner-container ${
            isProcessing && "spinner-container-active"
          } position-absolute top-50 start-50 translate-middle d-flex flex-column align-items-center`}
        >
          <Spinner
            animation="border"
            aria-describedby="spinnerLabel"
            role="status"
          />
          <p className="mt-2 text-center" id="spinnerLabel">
            Processing...
          </p>
        </div>
        <div
          className={`position-relative trends-chart-container ${
            isProcessing && "trends-chart-container-processing"
          }`}
        >
          <Bar data={data} options={options} />
        </div>
      </div>
    );
  },
);

export default TrendsChart;