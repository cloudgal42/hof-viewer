import {useCreatorTrends} from "../../../hooks/useCreatorTrends.ts";
import {Alert, Button, Card, Spinner} from "react-bootstrap";
import {TrendTypeToggle} from "../../details/CityTrends/TrendTypeToggle.tsx";
import {GroupBySelect} from "../../details/CityTrends/GroupBySelect.tsx";
import {useIntersectionObserver} from "usehooks-ts";
import {useTrendsOptions} from "../../../hooks/useTrendsOptions.ts";
import type {CreatorDetails} from "../../../interfaces/Creator.ts";
import {CONFIG} from "../../../config/Config.ts";
import {ErrorScreen} from "../../misc/ErrorScreen/ErrorScreen.tsx";
import {Bar} from "react-chartjs-2";
import { getFormattedTrendType } from "../../../utils/TrendFormat.ts";
import {useContext, useEffect} from "react";
import {ThemeContext} from "../../../context/ThemeContext.ts";

import "../../../css/components/TrendsChart.css";

const DAYS_IN_MILLISECONDS = 86400000;

export const CreatorTrends = (
  {creator, isLoading, fetchError} : {
    creator: CreatorDetails,
    isLoading: boolean,
    fetchError: Error | null
  }
) => {
  const createdAtEpoch = creator?.createdAt
    ? new Date(creator.createdAt).getTime()
    : new Date().getTime();
  const currEpoch = new Date().getTime();
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.4,
    freezeOnceVisible: true,
  });
  
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error("Theme context is null.");
  }
  
  const { trendType, setTrendType, groupPeriod, setGroupPeriod } =
    useTrendsOptions(currEpoch, createdAtEpoch);
  
  const {
    refetch, trendsData, isFetching, isProcessing, error, requireManualFetch
  } = useCreatorTrends({
    creator: creator.creatorName,
    groupPeriod,
    enabled: isIntersecting,
    trendType,
  });
  
  let trendsBody;
  
  const chartName = `${
    getFormattedTrendType(trendType)
  } per ${groupPeriod} day(s)`;
  
  const fontColor = context.theme === "dark" ? "#fff" : "#222";
  const gridColor = context.theme === "dark" ? { color: "#3a3a3a" } : {};
  
  const options = CONFIG.trendsChartOptions(chartName, fontColor, gridColor);
  
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
          <strong>Warning:</strong> Loading trends for creators{" "}
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
          className={context.theme === "light" ? "text-reset" : ""}
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
  } else if (fetchError) {
    trendsBody = (
      <ErrorScreen
        errorSummary="Failed to get views/favorites data timestamps of this creator :("
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
        {/*{isTrendsStale && !requireLoadingStatus && (*/}
        {/*  <Alert variant="warning" className="mt-3">*/}
        {/*    <p className="mb-0 d-inline">*/}
        {/*      <strong>Warning:</strong> Trends data is{" "}*/}
        {/*      <strong>out of date</strong>.{" "}*/}
        {/*      <Alert.Link*/}
        {/*        as="button"*/}
        {/*        className="bg-transparent border-0 p-0"*/}
        {/*        onClick={() =>*/}
        {/*          refetch()}*/}
        {/*      >*/}
        {/*        <span className="text-decoration-underline">*/}
        {/*          Update trends?*/}
        {/*        </span>*/}
        {/*      </Alert.Link>{" "}*/}
        {/*      (will take a while on popular creators!)*/}
        {/*    </p>*/}
        {/*  </Alert>*/}
        {/*)}*/}
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
            <TrendTypeToggle
              trendType={trendType}
              setTrendType={setTrendType}
            />
          </div>
          <div className="d-flex align-items-center gap-2 text-nowrap">
            <GroupBySelect
              groupPeriod={groupPeriod}
              setGroupPeriod={setGroupPeriod}
              currEpoch={currEpoch}
              createdAtEpoch={createdAtEpoch}
            />
          </div>
        </section>
        <section>
          {trendsBody}
        </section>
      </Card.Body>
    </Card>
  )
}