import {Alert, Button, Card, Form, Spinner, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {lazy, Suspense, useState} from "react";
import type {City, GroupedCities} from "../../interfaces/City.ts";
import {ErrorScreen} from "../ErrorScreen.tsx";
import {useQuery} from "@tanstack/react-query";
// import TrendsChart from "./TrendsChart.tsx";
import {groupCities} from "../../utils/GroupCities.ts";

const TrendsChart = lazy(() => import("./TrendsChart.tsx"));

interface CityTrendsProps {
  city: City | GroupedCities | undefined;
  isLoading: boolean;
  fetchError: Error | null;
}

const DAYS_IN_MILLISECONDS = 86400000;

export const CityTrends = ({city, isLoading, fetchError}: CityTrendsProps) => {
  const createdAtEpoch = city?.createdAt ? new Date(city.createdAt).getTime() : new Date().getTime();
  const currEpoch = new Date().getTime();

  const [trendType, setTrendType] = useState<string>("views");
  const [groupPeriod, setGroupPeriod] = useState<number>(() => {
    if (currEpoch > createdAtEpoch + (DAYS_IN_MILLISECONDS * 365)) return 7;
    else if (currEpoch > createdAtEpoch + (DAYS_IN_MILLISECONDS * 365 * 2)) return 30;

    return 1;
  });

  // Fetches all screenshots of the current creator, with a list of favorites and views entries if:
  // 1. User clicks on the "load trends" button
  // 2. If the creator ID is defined
  const {error, data, isFetching, refetch} = useQuery<City[]>({
    queryKey: ["detailedCities", city?.creatorId],
    queryFn: async () => {
      if (!city?.creatorId) return [];

      const res = await fetch(`${import.meta.env.VITE_HOF_SERVER}/screenshots?creatorId=${city.creatorId}&favorites=true&views=true`);
      const data = await res.json();

      if (!res.ok) {
        return Promise.reject(new Error(`${data.statusCode}: ${data.message}`));
      }

      return data;
    },
    refetchOnWindowFocus: false,
    enabled: false,
    retry: false,
  });

  const cityDetails = Array.isArray(city?.imageUrlFHD) ?
    data && groupCities(data).find(entry => entry.cityName === city?.cityName)
    : city;
  let trendsBody;

  if (city && Array.isArray(city.imageUrlFHD) && !data) {
    trendsBody = (
      <Alert variant="warning" className="my-3">
        <p className="mb-2">
          <strong>Warning:</strong> Loading trends for grouped screenshots <strong>will be performance
          intensive</strong> on the Hall of Fame server and potentially your browser.
          Do you want to continue?
        </p>
        <Button
          variant="outline-warning"
          onClick={() => !data && refetch()}
          disabled={isFetching}
        >
          {isFetching ? "Fetching data from HoF..." : "Load trends"}
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
  } else if (fetchError && !fetchError.message.includes("grouped screenshots")
    || error && city && Array.isArray(city.imageUrlFHD)) {
    trendsBody = (
      <ErrorScreen
        errorSummary="Failed to get views/favorites data timestamps of this city :("
        errorDetails={fetchError?.message || error?.message}
      />
    );
  } else if (cityDetails) {
    trendsBody = (
      <Suspense fallback={<div>Loading...</div>}>
        <TrendsChart city={cityDetails} trendType={trendType} groupPeriod={groupPeriod}/>
      </Suspense>
    );
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Trends</Card.Title>
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
              {/*<ToggleButton*/}
              {/*  value="uniqueViews"*/}
              {/*  id="uniqueViews"*/}
              {/*  variant="outline-primary"*/}
              {/*>*/}
              {/*  Views (Unique)*/}
              {/*</ToggleButton>*/}
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
                onChange={(e) => setGroupPeriod(parseInt(e.currentTarget.value))}
              >
                <option value="1">Days</option>
                {currEpoch > createdAtEpoch + (DAYS_IN_MILLISECONDS * 7)
                  && <option value="7">Weeks</option>
                }
                {currEpoch > createdAtEpoch + (DAYS_IN_MILLISECONDS * 30)
                  && <option value="30">1 Month</option>
                }
                {currEpoch > createdAtEpoch + (DAYS_IN_MILLISECONDS * 30 * 6)
                  && <option value="180">6 Months</option>
                }
                {currEpoch > createdAtEpoch + (DAYS_IN_MILLISECONDS * 365)
                  && <option value="365">1 Year</option>
                }
              </Form.Select>
            </div>
          </div>
        </section>
        <section>
          {trendsBody}
        </section>
      </Card.Body>
    </Card>
  )
}