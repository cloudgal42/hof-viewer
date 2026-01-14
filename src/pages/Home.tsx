import {Button, Form} from "react-bootstrap";
import {SortOrderButton} from "../components/SortOrderButton.tsx";
import {useMemo, useState} from "react";
import type {ContextType, SortOrder} from "../App.tsx";
import {SortDropdown} from "../components/SortDropdown.tsx";
import {type City, CityCard, type GroupedCities} from "../components/CityCard.tsx";
import {PlaceholderCard} from "../components/PlaceholderCard.tsx";
import {useOutletContext} from "react-router";

interface TotalScreenshotStats {
  combinedStats?: GroupedCities;
}

// Group all stats of each unique city name into one.
function groupCities(citiesToGroup: City[]) {
  const groupedScreenshots: City[][] = [];
  const groupedCities: GroupedCities[] = [];

  // 1. Get all distinct city names. Use Set() to filter down to only unique values
  // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/Set
  const cityNames = citiesToGroup.map(({cityName}) => cityName);
  const uniqueCityNames = [...new Set(cityNames)];

  // 2. Combine all unique city entries into 1 array
  uniqueCityNames.forEach(cityName => {
    const cityScreenshots = citiesToGroup.filter(city => city.cityName === cityName)
    groupedScreenshots.push(cityScreenshots);
  });

  // 3. Iterate through groupedScreenshots[], and push the new data into groupedCities[]
  groupedScreenshots.forEach(screenshotArr => {
    const screenshotStat: TotalScreenshotStats = {};
    screenshotArr.forEach(screenshot => {
      screenshotStat.combinedStats = {
        id: screenshot.cityName,
        isApproved: screenshot.isApproved,
        isReported: screenshot.isReported,
        favoritesCount: (typeof screenshotStat.combinedStats?.favoritesCount === "undefined") ? screenshot.favoritesCount : screenshotStat.combinedStats.favoritesCount + screenshot.favoritesCount,
        favoritingPercentage: 0, // FIXME
        viewsCount: (typeof screenshotStat.combinedStats?.viewsCount === "undefined") ? screenshot.viewsCount : screenshotStat.combinedStats.viewsCount + screenshot.viewsCount,
        uniqueViewsCount: (typeof screenshotStat.combinedStats?.uniqueViewsCount === "undefined") ? screenshot.uniqueViewsCount : screenshotStat.combinedStats.uniqueViewsCount + screenshot.uniqueViewsCount,
        cityName: screenshot.cityName,
        cityNameLatinized: screenshot.cityNameLatinized,
        cityNameLocale: screenshot.cityNameLocale,
        cityNameTranslated: screenshot.cityNameTranslated,
        cityMilestone: screenshot.cityMilestone,
        cityPopulation: screenshot.cityPopulation,
        renderSettings: screenshot.renderSettings,
        createdAt: screenshotArr[0].createdAt,
        createdAtFormatted: screenshotArr[0].createdAtFormatted,
        createdAtFormattedDistance: screenshotArr[0].createdAtFormattedDistance,
        creator: screenshot.creator,
        creatorId: screenshot.creatorId,
        imageUrl4K: (typeof screenshotStat.combinedStats?.imageUrl4K === "undefined") ? [] : screenshotStat.combinedStats.imageUrl4K,
        imageUrlFHD: (typeof screenshotStat.combinedStats?.imageUrlFHD === "undefined") ? [] : screenshotStat.combinedStats.imageUrlFHD,
        imageUrlThumbnail: screenshot.imageUrlThumbnail,
        mapName: screenshot.mapName,
        paradoxModIds: screenshot.paradoxModIds,
        shareParadoxModIds: screenshot.shareParadoxModIds,
        shareRenderSettings: screenshot.shareRenderSettings,
        __favorited: false,
      }

      screenshotStat.combinedStats?.imageUrlFHD.push(screenshot.imageUrlFHD);
      screenshotStat.combinedStats?.imageUrl4K.push(screenshot.imageUrl4K);
    });

    if (screenshotStat.combinedStats) {
      screenshotStat.combinedStats.favoritingPercentage = Math.round((screenshotStat.combinedStats.favoritesCount / screenshotStat.combinedStats.uniqueViewsCount) * 100);
        groupedCities.push(screenshotStat.combinedStats);
    }
  });
  // 4. Return the grouped cities
  return groupedCities;
}

export const Home = () => {
  const [sortOrder, setSortOrder] = useState<SortOrder>("Ascending");
  const [sortBy, setSortBy] = useState("date");
  const [isGrouped, setIsGrouped] = useState<boolean>(false);

  const {
    cities,
    setCity,
    setCurrCreator,
    isLoading,
  } = useOutletContext<ContextType>();

  const sortedCities = useMemo(() => {
    const citiesToSort = isGrouped ? groupCities(cities) : cities;
    const copiedCities = [...citiesToSort];

    switch (sortBy) {
      // Sort descending by default
      case "date":
        copiedCities.sort((a, b) => {
          const cityADate = new Date(a.createdAt).getTime();
          const cityBDate = new Date(b.createdAt).getTime();
          return cityBDate - cityADate;
        });
        break;
      case "name":
        break;
      case "population":
        copiedCities.sort((a, b) => b.cityPopulation - a.cityPopulation);
        break;
      case "views":
        copiedCities.sort((a, b) => b.viewsCount - a.viewsCount);
        break;
      case "favorites":
        copiedCities.sort((a, b) => b.favoritesCount - a.favoritesCount);
        break;
    }

    if (sortOrder === "Ascending") copiedCities.reverse();

    return copiedCities;
  }, [cities, isGrouped, sortBy, sortOrder]);

  let content;

  function validateAndSetCreator(creator: string) {
    if (creator.length === 24) {
      setCurrCreator(creator);
    }
  }

  function setCreator(formData: FormData) {
    const query = formData.get("creatorId");
    const queryString = query?.toString() || "";
    setCurrCreator(queryString);
  }

  if (isLoading) {
    content = (
      <>
        <PlaceholderCard/>
        <PlaceholderCard/>
        <PlaceholderCard/>
        <PlaceholderCard/>
        <PlaceholderCard/>
        <PlaceholderCard/>
      </>
    )
  } else if (cities.length > 0) {
    content = sortedCities.map(city =>
      <CityCard key={city.id} city={city} setCity={setCity} isCitiesGrouped={isGrouped}/>
    );
  } else {
    content = <p>No cities found.</p>
  }

  return (
    <div className="main-wrapper flex-grow-1 ms-sm-5 me-sm-5">
      <h2>Browse</h2>
      <section className="mt-3 mb-3">
        <Form.Label htmlFor="creatorId">Enter the Creator ID:</Form.Label>
        <form action={setCreator}>
          <div className="d-flex gap-2">
            <Form.Control
              type="text"
              name="creatorId"
              id="creatorId"
              aria-describedby="creatorIdHelpBlock"
              placeholder="Creator ID..."
              onChange={e => validateAndSetCreator(e.currentTarget.value)}
            />
            <Button type="submit" variant="dark">Search</Button>
          </div>
          <Form.Text id="creatorIdHelpBlock">Must be 24 characters long.</Form.Text>
        </form>
      </section>
      <section>
        <div className="d-flex mb-3 align-items-sm-center justify-content-between flex-column flex-sm-row">
          <h2 className="mb-0">Cities</h2>
          <div className="d-flex justify-content-between align-items-center gap-2">
            <div className="d-flex gap-2 align-items-center text-nowrap">
              <Form.Check
                name="groupCities"
                id="groupCitiesCheck"
                onClick={(e) => setIsGrouped(e.currentTarget.checked)}/>
              <Form.Label
                htmlFor="groupCitiesCheck"
                className="mb-0"
              >
                Group Cities
              </Form.Label>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <SortOrderButton sortOrder={sortOrder} setSortOrder={setSortOrder}/>
              <SortDropdown setSortBy={setSortBy}/>
            </div>
          </div>
        </div>
        <div id="city-feed" className="d-flex flex-wrap gap-3">
          {content}
        </div>
      </section>
    </div>
  )
}