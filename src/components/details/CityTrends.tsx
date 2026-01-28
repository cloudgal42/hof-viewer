import {Card, Form, Spinner, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {useState} from "react";
import type {City, GroupedCities} from "../../interfaces/City.ts";
import {TrendsChart} from "./TrendsChart.tsx";
import {ErrorScreen} from "../ErrorScreen.tsx";

interface CityTrendsProps {
  city: City | GroupedCities;
  isLoading: boolean;
  fetchStatus: number | undefined;
}

export const CityTrends = ({city, isLoading, fetchStatus}: CityTrendsProps) => {
  const [trendType, setTrendType] = useState<string>("views");
  const [groupPeriod, setGroupPeriod] = useState<number>(7);

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
                <option value="7">Weeks</option>
                <option value="30">1 Month</option>
                <option value="180">6 Months</option>
                <option value="365">1 Year</option>
              </Form.Select>
            </div>
          </div>
        </section>
        {isLoading ? (
          <div className="d-flex justify-content-center my-5 py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : fetchStatus === 200 ? (
          <section className="bg-white position-relative" style={{minHeight: "50vh"}}>
            <TrendsChart city={city} trendType={trendType} groupPeriod={groupPeriod} />
          </section>
        ) : (
          <ErrorScreen
            errorSummary="Failed to get views/favorites data timestamps of this city :("
            errorDetails={`HTTP Status: ${fetchStatus}. Please wait and try again.`}
          />
        )}
      </Card.Body>
    </Card>
  )
}