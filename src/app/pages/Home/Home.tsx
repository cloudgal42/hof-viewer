import {Button, Collapse, Form, OverlayTrigger, Tooltip} from "react-bootstrap";
import { SortOrderButton } from "./components/SortOrderButton/SortOrderButton.tsx";
import { useMemo, useState } from "react";
import { SortDropdown } from "./components/SortDropdown/SortDropdown.tsx";
import { CityCard } from "../../../features/city/components/CityCard/CityCard.tsx";
import { PlaceholderCard } from "../../../features/city/components/CityCard/PlaceholderCard.tsx";
import { NavLink, useSearchParams } from "react-router";
import { handleSetSearchParams } from "../../../utils/SearchParamHandlers.ts";
import InfiniteScroll from "react-infinite-scroll-component";

import type { City, GroupedCities } from "../../../interfaces/City.ts";
import { ErrorScreen } from "../../../components/errorscreen/ErrorScreen/ErrorScreen.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { useCreatorCities } from "../../../features/city/hooks/useCreatorCities.ts";
import { DefaultHelmet } from "../../../components/misc/DefaultHelmet/DefaultHelmet.tsx";

import Chirper from "../../../assets/Chirper.svg";
import { useDebounceCallback } from "usehooks-ts";
import Fuse from "fuse.js";
import {useGroupedCities} from "../../../hooks/useGroupedCities.ts";
import {useCreator} from "../../../features/creator/hooks/useCreator.ts";
import {PlaceholderCreatorCard} from "../../../features/creator/components/CreatorCard/PlaceholderCreatorCard.tsx";
import {CreatorCard} from "../../../features/creator/components/CreatorCard/CreatorCard.tsx";

import "./Home.css";

const DEFAULT_CITIES_PER_PAGE = 18;

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);

  const creator = searchParams.get("creator") || "";
  const sortOrder = searchParams.get("sortOrder") || "Descending";
  const sortBy = searchParams.get("sortBy") || "date";
  const groupStatus = searchParams.get("groupCities") || "off";
  const searchQuery = searchParams.get("search") || "";

  const [search, setSearch] = useState<string>(searchQuery);
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);
  
  const [isCreatorInfoOpen, setIsCreatorInfoOpen] = useState(false);

  const debouncedSetSearch = useDebounceCallback((e) => {
    setSearch(e.target.value);
    setIsDebouncing(false);
  }, 500);

  const { error, data, isFetching } = useCreatorCities(creator);
  
  const {groupCities} = useGroupedCities(creator);

  const cities = queryClient.getQueryData<City[]>([
    "detailedCities",
    data && data[0]?.creatorId,
  ]) ||
    queryClient.getQueryData<City[]>(["detailedCities", creator]) ||
    data;
  const sortedCities = useMemo(() => {
    if (!creator || isFetching || error || !cities) return [];

    // console.log(cities);

    const citiesToSort: City[] | GroupedCities[] = groupStatus === "on"
      ? groupCities(cities)
      : cities;
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
        copiedCities.sort((a, b) => {
          const cityAName = a.cityNameLatinized || a.cityName;
          const cityBName = b.cityNameLatinized || b.cityName;
          return cityBName.localeCompare(cityAName);
        });
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
      case "favoritesRatio":
        copiedCities.sort((a, b) => {
          const cityAFavRatio = a.favoritesCount / a.uniqueViewsCount;
          const cityBFavRatio = b.favoritesCount / b.uniqueViewsCount;

          return cityBFavRatio - cityAFavRatio;
        });
        break;
    }

    if (sortOrder === "Ascending") copiedCities.reverse();

    return copiedCities;
  }, [cities, creator, error, groupCities, groupStatus, isFetching, sortBy, sortOrder]);

  const fuse = new Fuse(sortedCities, {
    threshold: 0.2,
    includeScore: false,
    keys: ["cityName", "cityNameTranslated", "cityNameLatinized"],
  });
  
  const searchedCities = search
    ? fuse.search(search).map((entry) => entry.item)
    : sortedCities;
  
  const paginatedCities = searchedCities.toSpliced(
    page * DEFAULT_CITIES_PER_PAGE,
  );
  
  const {
    error: creatorError, data: creatorData, isFetching: isFetchingCreator
  } = useCreator(creator, isCreatorInfoOpen);
  
  function setCreator(formData: FormData) {
    const query = formData.get("creatorId");
    const queryString = query?.toString() || "";
    if (queryString === creator) return;

    setSearchParams(
      handleSetSearchParams(searchParams, "creator", queryString),
    );
  }

  let creatorInfo;
  let cityRow;
  
  if (isFetchingCreator || !creatorData) {
    creatorInfo = <PlaceholderCreatorCard />
  } else if (creatorError) {
    creatorInfo = <ErrorScreen
      errorSummary="Failed to get creator info :("
      errorDetails={creatorError.message}
    />
  } else if (creatorData) {
    creatorInfo = <CreatorCard creator={creatorData} />
  }

  if (isFetching || isDebouncing) {
    cityRow = (
      <div className="placeholder-feed d-flex flex-wrap gap-3">
        <PlaceholderCard />
        <PlaceholderCard />
        <PlaceholderCard />
        <PlaceholderCard />
        <PlaceholderCard />
        <PlaceholderCard />
      </div>
    );
  } else if (error) {
    cityRow = (
      <ErrorScreen
        errorSummary="Failed to get screenshots for this creator :("
        errorDetails={error.message}
      />
    );
  } else if (search && searchedCities.length === 0) {
    cityRow = (
      <ErrorScreen
        errorSummary="No cities found :("
        errorDetails="Double check your search query and try again."
      />
    );
  } else if (sortedCities.length === 0 && creator) {
    cityRow = (
      <ErrorScreen
        errorSummary="This creator has not yet posted any screenshots :("
        errorDetails="Maybe try looking for another creator?"
      />
    );
  } else if (!navigator.onLine) {
    cityRow = (
      <ErrorScreen
        errorSummary="You are offline :("
        errorDetails="Double check your Internet connection and try again."
      />
    );
  } else if (searchedCities.length > 0) {
    cityRow = (
      <InfiniteScroll
        next={() => setPage((a) => a + 1)}
        hasMore={searchedCities.length > paginatedCities.length}
        className="d-flex flex-wrap gap-3"
        loader={
          <div className="placeholder-feed d-flex flex-wrap gap-3">
            <PlaceholderCard />
            <PlaceholderCard />
            <PlaceholderCard />
            <PlaceholderCard />
            <PlaceholderCard />
            <PlaceholderCard />
          </div>
        }
        dataLength={paginatedCities.length}
      >
        {paginatedCities.map((city) => (
          <CityCard
            key={city.id}
            city={city}
          />
        ))}
      </InfiniteScroll>
    );
  } else {
    cityRow = (
      <div className="d-flex text-muted flex-column align-items-center text-center">
        <img src={Chirper} width="162" height="162" alt="Chirper" />
        <p className="mb-1">Search by the creator name/ID to get started.</p>
        <p className="mb-1">
          Don't know who to search for? Browse screenshots from great HoF
          creators{" "}
          <NavLink to={`/random`}>
            here
          </NavLink>
        </p>
      </div>
    );
  }

  return (
    <div className="main-wrapper flex-grow-1 ms-sm-5 me-sm-5">
      <DefaultHelmet />
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
            <Button type="submit" variant="primary">Search</Button>
          </div>
          <Form.Text id="creatorIdHelpBlock">
            Can either be the username or the public Creator ID.
          </Form.Text>
        </form>
      </section>
      {creator && <section className="mb-3">
        <div className="mb-2">
          <h3 className="d-inline">Creator Info</h3>
          <Button
            variant="link"
            size="sm"
            onClick={() => setIsCreatorInfoOpen(!isCreatorInfoOpen)}
          >
            [{isCreatorInfoOpen ? "hide" : "show"}]
          </Button>
        </div>
        <Collapse in={isCreatorInfoOpen}>
          <div>
            {creatorInfo}
          </div>
        </Collapse>
      </section>}
      <section>
        <div className="d-flex gap-2 gap-sm-0 mb-2 align-items-md-center justify-content-between flex-column flex-md-row">
          <h3 className="mb-0">
            Cities
            {(searchedCities && creator.length > 0 && !isFetching) && (
              <span className="ms-2 fs-6 text-muted text-nowrap">
                {searchedCities.length}{" "}
                {searchedCities.length > 1 ? "results" : "result"}
              </span>
            )}
          </h3>
          <div className="d-flex justify-content-between align-items-center gap-2">
            <div className="d-flex gap-2 align-items-center text-nowrap">
              <Form.Check
                name="groupCities"
                id="groupCitiesCheck"
                onClick={(e) => {
                  setSearchParams(handleSetSearchParams(
                    searchParams,
                    "groupCities",
                    e.currentTarget.checked ? "on" : "off",
                  ));
                }}
                defaultChecked={groupStatus === "on"}
              />
              <OverlayTrigger
                overlay={
                  <Tooltip>
                    When enabled, group all screenshots with the same city name
                    into one entry.
                  </Tooltip>
                }
              >
                <Form.Label
                  htmlFor="groupCitiesCheck"
                  className="mb-0"
                >
                  Group Cities
                </Form.Label>
              </OverlayTrigger>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <SortOrderButton
                sortOrder={sortOrder}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
              />
              <SortDropdown
                searchParams={searchParams}
                setSearchParams={setSearchParams}
              />
            </div>
          </div>
        </div>
        {(creator && sortedCities.length > 0) && (
          <Form.Control
            className="mb-2"
            type="search"
            name="citySearch"
            aria-label="Search by city name"
            placeholder="Search by city name..."
            onChange={(e) => {
              setIsDebouncing(true);
              debouncedSetSearch(e);
            }}
            defaultValue={searchQuery}
            onBlur={(e) => {
              setSearchParams(handleSetSearchParams(
                searchParams,
                "search",
                e.target.value,
              ));
            }}
          />
        )}
        <div id="city-feed">
          {cityRow}
        </div>
      </section>
    </div>
  );
};
export default Home;
