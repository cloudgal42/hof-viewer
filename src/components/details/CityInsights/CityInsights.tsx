import { Card } from "react-bootstrap";
import type { City, GroupedCities } from "../../../interfaces/City.ts";
import { StackedChart } from "./StackedChart.tsx";

interface CityInsightsProps {
  city: GroupedCities;
}

function getRandomColor() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);

  return `rgb(${r}, ${g}, ${b})`;
}

export const CityInsights = ({ city }: CityInsightsProps) => {
  const cities = city.cities.map(entry => ({
    ...entry,
    backgroundColor: getRandomColor(),
  }));

  const favoritesData = cities
    .sort((a, b) => b.favoritesCount - a.favoritesCount)
    .map((entry) => {
      return {
        id: entry.id,
        label: `Screenshot ${new Date(entry.createdAt).toLocaleString()})`,
        data: [100 * (entry.favoritesCount / city.favoritesCount)],
        backgroundColor: entry.backgroundColor,
        details: entry,
      };
    });

  const viewsData = cities
    .sort((a, b) => b.viewsCount - a.viewsCount)
    .map((entry) => {
      return {
        id: entry.id,
        label: `Screenshot ${new Date(entry.createdAt).toLocaleString()})`,
        data: [100 * (entry.viewsCount / city.viewsCount)],
        backgroundColor: entry.backgroundColor,
        details: entry,
      }
    })

  return (
    <Card>
      <Card.Body>
        <section className="mb-2">
          <h3>
            <Card.Title>Share of total Views</Card.Title>
          </h3>
          <StackedChart stats={viewsData} />
        </section>
        <section>
          <h3>
            <Card.Title>Share of total Favorites</Card.Title>
          </h3>
          <StackedChart stats={favoritesData} />
        </section>
      </Card.Body>
    </Card>
  );
};
