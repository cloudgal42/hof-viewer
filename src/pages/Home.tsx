import {Button, Form, OverlayTrigger, Tooltip} from "react-bootstrap";
import {SortOrderButton} from "../components/home/SortOrderButton/SortOrderButton.tsx";
import {useMemo, useState} from "react";
import type {ContextType} from "../App.tsx";
import {SortDropdown} from "../components/home/SortDropdown/SortDropdown.tsx";
import {CityCard} from "../components/home/CityCard/CityCard.tsx";
import {PlaceholderCard} from "../components/home/CityCard/PlaceholderCard.tsx";
import {useOutletContext, useSearchParams} from "react-router";
import {handleSetSearchParams} from "../utils/SearchParamHandlers.ts";
import InfiniteScroll from "react-infinite-scroll-component";

import {groupCities} from "../utils/GroupCities.ts";
import type {City, GroupedCities} from "../interfaces/City.ts";
import {ErrorScreen} from "../components/misc/ErrorScreen/ErrorScreen.tsx";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useCreatorCities} from "../hooks/useCreatorCities.ts";

const DEFAULT_CITIES_PER_PAGE = 18;

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);

  const creator = searchParams.get("creator") || "";
  const sortOrder = searchParams.get("sortOrder") || "Ascending";
  const sortBy = searchParams.get("sortBy") || "date";
  const groupStatus = searchParams.get("groupCities") || "off";
  // const [sortOrder, setSortOrder] = useState<SortOrder>("Ascending");
  // const [sortBy, setSortBy] = useState("date");
  // const [isGrouped, setIsGrouped] = useState<boolean>(false);

  const {
    setCity,
  } = useOutletContext<ContextType>();

  const {error, data, isFetching} = useCreatorCities(creator);

  const cities =
    queryClient.getQueryData<City[]>(["detailedCities", data && data[0]?.creatorId])
    || queryClient.getQueryData<City[]>(["detailedCities", creator])
    || data;
  const sortedCities = useMemo(() => {
    if (!creator || isFetching || error || !cities) return [];

    // console.log(cities);

    const citiesToSort: City[] | GroupedCities[] = groupStatus === "on" ? groupCities(cities) : cities;
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
    if (queryString === creator) return;

    setSearchParams(handleSetSearchParams(searchParams, "creator", queryString));
  }

  let content;

  if (isFetching) {
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
  } else if (error) {
    content = (
      <ErrorScreen
        errorSummary="Failed to get screenshots for this creator :("
        errorDetails={error.message}
      />
    )
  } else if (!navigator.onLine) {
    content = (
      <ErrorScreen
        errorSummary="You are offline :("
        errorDetails="Double check your Internet connection and try again."
      />
    )
  } else if (sortedCities.length > 0) {
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
            <Button type="submit" variant="primary">Search</Button>
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
              <OverlayTrigger overlay={<Tooltip>When enabled, group all screenshots with the same city name into one
                entry.</Tooltip>}>
                <Form.Label
                  htmlFor="groupCitiesCheck"
                  className="mb-0"
                >
                  Group Cities
                </Form.Label>
              </OverlayTrigger>

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
export default Home