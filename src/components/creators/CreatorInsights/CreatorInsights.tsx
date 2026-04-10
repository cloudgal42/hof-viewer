import { Card } from "react-bootstrap";
import { StackedChart } from "../../details/CityInsights/StackedChart.tsx";
import type { GroupedCities } from "../../../interfaces/City.ts";
import { getRandomColor } from "../../../utils/RandomColor.ts";

export const CreatorInsights = ({ cities }: { cities: GroupedCities[] }) => {
  const totalFavorites = cities.reduce((accumulator, currVal) => {
    return accumulator + currVal.favoritesCount;
  }, 0);
  const totalViews = cities.reduce((accumulator, currVal) => {
    return accumulator + currVal.viewsCount;
  }, 0);

  const citiesWithColors = cities.map((city) => ({
    ...city,
    imageUrl4K: city.imageUrl4K[city.imageUrl4K.length - 1],
    imageUrlFHD: city.imageUrlFHD[city.imageUrlFHD.length - 1],
    imageUrlThumbnail: city.imageUrlThumbnail[city.imageUrlThumbnail.length - 1],
    backgroundColor: getRandomColor(),
  }));

  const favoritesData = citiesWithColors
    .sort((a, b) => b.favoritesCount - a.favoritesCount)
    .map((entry) => {
      return {
        id: entry.id,
        label: entry.cityNameTranslated
          ? `${entry.cityName} (${entry.cityNameTranslated})`
          : `${entry.cityName}`,
        data: [100 * (entry.favoritesCount / totalFavorites)],
        backgroundColor: entry.backgroundColor,
        details: entry,
      };
    });

  const viewsData = citiesWithColors
    .sort((a, b) => b.viewsCount - a.viewsCount)
    .map((entry) => {
      return {
        id: entry.id,
        label: entry.cityNameTranslated
          ? `${entry.cityName} (${entry.cityNameTranslated})`
          : `${entry.cityName}`,
        data: [100 * (entry.viewsCount / totalViews)],
        backgroundColor: entry.backgroundColor,
        details: entry,
      };
    });

  return (
    <Card>
      <Card.Body>
        <section className="mb-2">
          <h3>
            <Card.Title>Share of total Views by City (Grouped)</Card.Title>
          </h3>
          <StackedChart stats={viewsData} />
        </section>
        <section>
          <h3>
            <Card.Title>Share of total Favorites by City (Grouped)</Card.Title>
          </h3>
          <StackedChart stats={favoritesData} />
        </section>
      </Card.Body>
    </Card>
  );
};
