import {
  Alert,
  Button,
  Card,
  Form,
  Spinner,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import { lazy, Suspense, useContext, useState } from "react";
import type { City, GroupedCities } from "../../../interfaces/City.ts";
import { ErrorScreen } from "../../misc/ErrorScreen/ErrorScreen.tsx";
import { ThemeContext } from "../../../context/ThemeContext.ts";
import { useCreatorTrends } from "../../../hooks/useCreatorTrends.ts";

const TrendsChart = lazy(() => import("./TrendsChart.tsx"));

interface CityTrendsProps {
  city: City | GroupedCities | undefined;
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

  // Fetches all screenshots of the current creator, with a list of favorites and views entries if:
  // 1. User clicks on the "load trends" button
  // 2. If the creator ID is defined
  // 3. If this is a grouped city
  const { error, data, isFetching, refetch } = useCreatorTrends({
    creator: city?.creatorId,
    cityName: city?.cityName,
  });
  
  let trendsBody;

  // This is used for trends graph.
  // Only use data from useCreatorTrends if viewing a grouped city.
  const cityWithTrends = data && city
    && Array.isArray(city.imageUrlFHD) ? data[0] : city;
  
  const isTrendsStale =
    (cityWithTrends?.views && cityWithTrends.views.length !== city?.viewsCount)
    || (cityWithTrends?.favorites && cityWithTrends?.favorites.length !== city?.favoritesCount);

  console.debug(`Total view entries: ${cityWithTrends?.views?.length} | Total views: ${city?.viewsCount}`);
  console.debug(`Total favorites entries: ${cityWithTrends?.favorites?.length} | Total favorites: ${city?.favoritesCount}`);
  console.debug("Trends data out of date/stale?", isTrendsStale)

  if (city && Array.isArray(city.imageUrlFHD) && !data) {
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
          onClick={() => !data && refetch()}
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
  } else if (isLoading || isFetching) {
    trendsBody = (
      <div className="d-flex justify-content-center my-5 py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
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
  } else if (cityWithTrends) {
    trendsBody = (
      <Suspense
        fallback={
          <div className="d-flex flex-column align-items-center my-5 py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-2 text-center text-muted">Processing...</p>
          </div>
        }
      >
        {isTrendsStale && (
          <Alert variant="warning" className="mt-3">
            <p className="mb-0 d-inline">
              <strong>Warning:</strong> Trends data is{" "}
              <strong>out of date</strong>.{" "}
              <Alert.Link
                as="button"
                className="bg-transparent border-0 p-0"
                onClick={() => refetch()}
              >
                <span className="text-decoration-underline">Update trends?</span>
              </Alert.Link>{" "}
              (will take a while on popular creators!)
            </p>
          </Alert>
        )}
        <TrendsChart
          city={cityWithTrends}
          trendType={trendType}
          groupPeriod={groupPeriod}
        />
      </Suspense>
    );
  }

  return (
    <Card>
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
