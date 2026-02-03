import {Card} from "react-bootstrap";
import type {City, GroupedCities} from "../../../interfaces/City.ts";
import {StackedChart} from "./StackedChart.tsx";

interface CityInsightsProps {
  city: GroupedCities;
}

export const CityInsights = ({city}: CityInsightsProps) => {
  return (
    <Card>
      <Card.Body>
        <section className="mb-2">
          <h3>
            <Card.Title>Share of total Views</Card.Title>
          </h3>
          <StackedChart city={city} type="views" />
        </section>
        <section>
          <h3>
            <Card.Title>Share of total Favorites</Card.Title>
          </h3>
          <StackedChart city={city} type="favorites" />
        </section>
      </Card.Body>
    </Card>
  )
}