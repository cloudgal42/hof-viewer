import {Button, Form} from "react-bootstrap";
import {SortOrderButton} from "../components/SortOrderButton.tsx";
import {useEffect, useMemo, useState} from "react";
import type {ContextType} from "../App.tsx";
import {SortDropdown} from "../components/SortDropdown.tsx";
import {type City, CityCard, type GroupedCities} from "../components/CityCard.tsx";
import {PlaceholderCard} from "../components/PlaceholderCard.tsx";
import {useOutletContext, useSearchParams} from "react-router";
import {handleSetSearchParams} from "../utils/SearchParamHandlers.ts";
import InfiniteScroll from "react-infinite-scroll-component";

import SadChirper from "../assets/sadChirpyOutline.svg";

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

const DEFAULT_CITIES_PER_PAGE = 18;

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [fetchStatus, setFetchStatus] = useState<number>();
  // const [errMsg, setErrMsg] = useState<string>();
  const [page, setPage] = useState<number>(1);

  const creator = searchParams.get("creator") || "";
  const sortOrder = searchParams.get("sortOrder") || "Ascending";
  const sortBy = searchParams.get("sortBy") || "date";
  const groupStatus = searchParams.get("groupCities") || "off";
  // const [sortOrder, setSortOrder] = useState<SortOrder>("Ascending");
  // const [sortBy, setSortBy] = useState("date");
  // const [isGrouped, setIsGrouped] = useState<boolean>(false);

  const {
    cities, setCities,
    setCity,
    isLoading, setIsLoading,
  } = useOutletContext<ContextType>();

  useEffect(() => {
    let ignore = false;
    const creatorMatchesCities = cities[0]?.creatorId === creator || cities[0]?.creator.creatorName.toLowerCase() === creator.toLowerCase();
    if (!creator || (cities.length !== 0 && creatorMatchesCities)) return;

    async function getCreatorCities() {
      setIsLoading(true);
      const res = await fetch(`https://halloffame.cs2.mtq.io/api/v1/screenshots?creatorId=${creator}`);
      const data = await res.json();

      setFetchStatus(res.status);

      if (res.ok && !ignore) {
        setCities(data);
        setIsLoading(false);
      } else {
        setCities([]);
        setIsLoading(false);
      }

      // const screenshots = JSON.parse(Screenshots);
      // setCities(screenshots);
      // setIsLoading(false);

    }

    getCreatorCities();

    return () => {
      ignore = true
    };
  }, [creator]);

  const sortedCities = useMemo(() => {
    const citiesToSort = groupStatus === "on" ? groupCities(cities) : cities;
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
  }, [cities, groupStatus, sortBy, sortOrder]);

  const paginatedCities = sortedCities.toSpliced(page * DEFAULT_CITIES_PER_PAGE);

  // function validateAndSetCreator(creator: string) {
  //   setCities([]);
  //   setSearchParams(handleSetSearchParams(searchParams, "creator", creator));
  // }

  function setCreator(formData: FormData) {
    const query = formData.get("creatorId");
    const queryString = query?.toString() || "";
    setCities([]);
    setSearchParams(handleSetSearchParams(searchParams, "creator", queryString));
  }

  let content;

  if (isLoading) {
    content = (
      <div className="placeholder-feed d-flex flex-wrap gap-3">
        <PlaceholderCard/>
        <PlaceholderCard/>
        <PlaceholderCard/>
        <PlaceholderCard/>
        <PlaceholderCard/>
        <PlaceholderCard/>
      </div>
    )
  } else if (cities.length > 0) {
    content = (
      <InfiniteScroll
        next={() => setPage(a => a + 1)}
        hasMore={sortedCities.length > paginatedCities.length}
        className="d-flex flex-wrap gap-3"
        loader={
          <div className="placeholder-feed d-flex flex-wrap gap-3">
            <PlaceholderCard/>
            <PlaceholderCard/>
            <PlaceholderCard/>
            <PlaceholderCard/>
            <PlaceholderCard/>
            <PlaceholderCard/>
          </div>
        }
        dataLength={paginatedCities.length}
      >
        {paginatedCities.map(city =>
          <CityCard key={city.id} city={city} setCity={setCity} isCitiesGrouped={groupStatus === "on"}/>
        )}
      </InfiniteScroll>
    );
  } else if (fetchStatus && fetchStatus !== 200) {
    content = (
      <div className="d-flex flex-column align-items-center text-center">
        <img src={SadChirper} width="148" height="148" alt="" />
        <p className="text-muted mb-1">
          {fetchStatus === 404 ? "No cities found :(" : "Something went wrong :("}
        </p>
        <p className="text-muted mb-1">
          {fetchStatus === 404 ?
            "Either the creator doesn't exist, or they have not posted any screenshots."
            : "Please wait for a while and try again."
          }
        </p>
      </div>
    )
  } else {
    content = <p>Search by the creator name/ID to get started.</p>
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
              defaultValue={creator}
              // onChange={e => validateAndSetCreator(e.currentTarget.value)}
            />
            <Button type="submit" variant="dark">Search</Button>
          </div>
          <Form.Text id="creatorIdHelpBlock">Can either be the username or the public Creator ID.</Form.Text>
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
                onClick={(e) => {
                  setSearchParams(handleSetSearchParams(searchParams, "groupCities", e.currentTarget.checked ? "on" : "off"));
                }}
                defaultChecked={groupStatus === "on"}
              />
              <Form.Label
                htmlFor="groupCitiesCheck"
                className="mb-0"
              >
                Group Cities
              </Form.Label>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <SortOrderButton sortOrder={sortOrder} searchParams={searchParams} setSearchParams={setSearchParams}/>
              <SortDropdown searchParams={searchParams} setSearchParams={setSearchParams}/>
            </div>
          </div>
        </div>
        <div id="city-feed">
          {content}
        </div>
      </section>
    </div>
  )
}