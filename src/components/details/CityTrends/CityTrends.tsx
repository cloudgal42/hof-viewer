import {
  Alert,
  Button,
  Card,
  Form,
  Spinner,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import { useContext, useState } from "react";
import type { City, GroupedCities } from "../../../interfaces/City.ts";
import { ErrorScreen } from "../../misc/ErrorScreen/ErrorScreen.tsx";
import { ThemeContext } from "../../../context/ThemeContext.ts";
import { useIntersectionObserver } from "usehooks-ts";
import { useCityTrendsWorker } from "../../../hooks/useCityTrendsWorker.ts";
import { Bar } from "react-chartjs-2";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

import "../../../css/components/TrendsChart.css";
import {useCityTrends} from "../../../hooks/useCityTrends.ts";

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

interface CityTrendsProps {
  city: City | GroupedCities;
  isLoading: boolean;
  fetchError: Error | null;
}

const DAYS_IN_MILLISECONDS = 86400000;

export const CityTrends = (
  { city, isLoading, fetchError }: CityTrendsProps,
) => {
  const createdAtEpoch = city?.createdAt
    ? new Date(city.createdAt).getTime()
    : new Date().getTime();
  const currEpoch = new Date().getTime();
  const theme = useContext(ThemeContext);

  const [trendType, setTrendType] = useState<string>("views");
  const [groupPeriod, setGroupPeriod] = useState<number>(() => {
    if (currEpoch >= createdAtEpoch + (DAYS_IN_MILLISECONDS * 365 * 2)) {
      return 30;
    } else if (currEpoch >= createdAtEpoch + (DAYS_IN_MILLISECONDS * 6 * 30)) {
      return 7;
    }

    return 1;
  });

  // TODO: Consider if this entire component should become reusable
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.4,
    freezeOnceVisible: true,
  });

  // TODO: Rename this hook to smth more appropriate
  const {
    error,
    trendsData,
    isFetching,
    isProcessing,
    isTrendsStale,
    refetch,
    requireManualFetch
  } = useCityTrends({
    enabled: isIntersecting,
    groupPeriod,
    trendType,
    creator: city.creator.creatorName,
    city
  });

  let trendsBody;

  const chartName = `${
    getFormattedTrendType(trendType)
  } per ${groupPeriod} day(s)`;

  const fontColor = theme === "dark" ? "#fff" : "#222";
  const gridColor = theme === "dark" ? { color: "#3a3a3a" } : {};

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

  const labels = trendsData ? Object.keys(trendsData) : [""];

  const trendsDataForChart = {
    labels,
    datasets: [
      {
        label: chartName,
        data: trendsData,
        backgroundColor: (trendType === "favorites")
          ? "rgba(255, 99, 132, 0.5)"
          : "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const requireLoadingStatus = isLoading || isFetching || isProcessing;

  if (requireManualFetch) {
    trendsBody = (
      <Alert variant="warning" className="my-3">
        <p className="mb-2">
          <strong>Warning:</strong> Loading trends for grouped screenshots{" "}
          <strong>
            will be performance intensive
          </strong>{" "}
          on the Hall of Fame server and potentially your browser,{" "}
          <strong>
            especially on popular accounts
          </strong>. Do you want to continue?
        </p>
        <Button
          variant="outline-warning"
          className={theme === "light" ? "text-reset" : ""}
          onClick={() => !trendsData && refetch()}
          disabled={isFetching}
        >
          {isFetching
            ? (
              <>
                Fetching data from HoF...
                <Spinner
                  animation="border"
                  className="ms-2"
                  role="status"
                  size="sm"
                >
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </>
            )
            : "Load trends"}
        </Button>
      </Alert>
    );
  } else if (
    fetchError && !fetchError.message.includes("grouped screenshots") ||
    error && city && Array.isArray(city.imageUrlFHD)
  ) {
    trendsBody = (
      <ErrorScreen
        errorSummary="Failed to get views/favorites data timestamps of this city :("
        errorDetails={fetchError?.message || error?.message}
      />
    );
  } else if (currEpoch - createdAtEpoch < DAYS_IN_MILLISECONDS) {
    trendsBody = (
      <p className="text-center text-muted my-5 py-5">
        Come back on another day to see your city trends!
      </p>
    );
  } else {
    trendsBody = (
      <>
        {isTrendsStale && !requireLoadingStatus && (
          <Alert variant="warning" className="mt-3">
            <p className="mb-0 d-inline">
              <strong>Warning:</strong> Trends data is{" "}
              <strong>out of date</strong>.{" "}
              <Alert.Link
                as="button"
                className="bg-transparent border-0 p-0"
                onClick={() => refetch()}
              >
                <span className="text-decoration-underline">
                  Update trends?
                </span>
              </Alert.Link>{" "}
              (will take a while on popular creators!)
            </p>
          </Alert>
        )}
        <div className="position-relative">
          <div
            className={`spinner-container ${
              requireLoadingStatus && "spinner-container-active"
            } position-absolute top-50 start-50 translate-middle d-flex flex-column align-items-center`}
          >
            <Spinner
              animation="border"
              aria-describedby="spinnerLabel"
              role="status"
            />
            <p className="mt-2 text-center" id="spinnerLabel">
              {isProcessing ? "Processing stats..." : "Fetching data..."}
            </p>
          </div>
          <div
            className={`position-relative trends-chart-container ${
              requireLoadingStatus && "trends-chart-container-processing"
            }`}
          >
            <Bar data={trendsDataForChart} options={options} />
          </div>
        </div>
      </>
    );
  }

  return (
    <Card ref={ref}>
      <Card.Body>
        <h3>
          <Card.Title>Trends</Card.Title>
        </h3>
        <section className="mb-2 d-flex flex-column flex-md-row justify-content-md-between align-items-md-center gap-2">
          <div>
            <ToggleButtonGroup
              type="radio"
              className="w-100"
              name="trendsType"
              aria-label="Data type"
              value={trendType}
              onChange={(value) => setTrendType(value)}
            >
              <ToggleButton
                value="views"
                id="views"
                variant="outline-primary"
              >
                Views
              </ToggleButton>
              <ToggleButton
                value="uniqueViews"
                id="uniqueViews"
                variant="outline-primary"
              >
                Views (Unique)
              </ToggleButton>
              <ToggleButton
                value="favorites"
                id="favorites"
                variant="outline-primary"
              >
                Favorites
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <div className="d-flex align-items-center gap-2 text-nowrap">
            <label htmlFor="groupPeriod">Group by</label>
            <div>
              <Form.Select
                name="groupPeriod"
                id="groupPeriod"
                value={groupPeriod}
                onChange={(e) =>
                  setGroupPeriod(parseInt(e.currentTarget.value))}
              >
                <option value="1">Days</option>
                {currEpoch > createdAtEpoch + (DAYS_IN_MILLISECONDS * 7) &&
                  <option value="7">Weeks</option>}
                {currEpoch > createdAtEpoch + (DAYS_IN_MILLISECONDS * 30) &&
                  <option value="30">1 Month</option>}
                {currEpoch > createdAtEpoch + (DAYS_IN_MILLISECONDS * 30 * 6) &&
                  <option value="180">6 Months</option>}
                {currEpoch > createdAtEpoch + (DAYS_IN_MILLISECONDS * 365) &&
                  <option value="365">1 Year</option>}
              </Form.Select>
            </div>
          </div>
        </section>
        <section>
          {trendsBody}
        </section>
      </Card.Body>
    </Card>
  );
};
