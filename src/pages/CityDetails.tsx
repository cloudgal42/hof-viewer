import {Button, Card, OverlayTrigger, Tooltip} from "react-bootstrap";
import {NavLink, useNavigate, useOutletContext, useParams, useSearchParams} from "react-router";
import type {ContextType} from "../App.tsx";
import {BoxArrowUpRight, ChevronDown, ChevronLeft, Eye, Heart, Person, Trophy} from "react-bootstrap-icons";
import {createContext, lazy, Suspense, useState} from "react";
import {DEFAULT_IMAGES_PER_PAGE} from "../components/details/CityGallery/CityGallery.tsx";

import PlaceholderImg from "../assets/placeholder.svg"
import {ModList} from "../components/details/Playset/ModList.tsx";
import {RenderSettings} from "../components/details/RenderSettings/RenderSettings.tsx";
import {PlaceholderDetails} from "../components/details/Details/PlaceholderDetails.tsx";
import {CityTrends} from "../components/details/CityTrends/CityTrends.tsx";
import {ErrorScreen} from "../components/misc/ErrorScreen/ErrorScreen.tsx";
import {useQuery} from "@tanstack/react-query";
import type {City} from "../interfaces/City.ts";
import {PlaceholderFeatModCard} from "../components/details/FeatModCard/PlaceholderFeatModCard.tsx";
import {FeatModCard} from "../components/details/FeatModCard/FeatModCard.tsx";
import * as React from "react";
import {CityInsights} from "../components/details/CityInsights/CityInsights.tsx";
import {useCreatorCities} from "../hooks/useCreatorCities.ts";
import {groupCities} from "../utils/GroupCities.ts";

import "../css/components/CityDetails.css"
import {useMediaQuery} from "usehooks-ts";
import {SplitLayoutContext} from "../context/SplitLayoutContext.ts";

const CityGallery = lazy(() => import("../components/details/CityGallery/CityGallery.tsx"));

const cityMilestones = [
  "Tiny Village",
  "Small Village",
  "Large Village",
  "Grand Village",
  "Tiny Town",
  "Boom Town",
  "Busy Town",
  "Big Town",
  "Great Town",
  "Small City",
  "Big City",
  "Large City",
  "Huge City",
  "Grand City",
  "Metropolis",
  "Thriving Metropolis",
  "Flourishing Metropolis",
  "Expansive Metropolis",
  "Massive Metropolis",
  "Megalopolis",
]

const CityDetails = () => {
  const {
    city,
  } = useOutletContext<ContextType>();
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(1);
  const [isLoadMoreHovered, setIsLoadMoreHovered] = useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const cityParam = useParams().city;

  const isCitiesGrouped = searchParams.get("groupStatus") === "on";
  const cityCreator = searchParams.get("creator");
  const {
    data: creatorCities,
    error: creatorCitiesError,
    isFetching: isCreatorCitiesFetching
  } = useCreatorCities(cityCreator);

  const {error, data, isFetching} = useQuery<City>({
    queryKey: ["city", {id: cityParam}],
    queryFn: async () => {
      // maybe FIXME?
      const res = await fetch(`${import.meta.env.VITE_HOF_SERVER}/screenshots/${cityParam}?favorites=true&views=true`);
      const data = await res.json();

      if (!res.ok) {
        return Promise.reject(new Error(`${data.statusCode}: ${data.message}`));
      }

      return data;
    },
    refetchOnWindowFocus: false,
    enabled: Boolean(!city?.favorites && !city?.views && !isCitiesGrouped ||
      city?.showcasedModId && !isCitiesGrouped || !isCitiesGrouped),
    retry: false,
  });

  const fetchError = error || creatorCitiesError;

  const cityDetails = data || city ||
    creatorCities && groupCities(creatorCities).find(entry => entry.cityName === cityParam);

  const isWidthNeededForSplitLayout = useMediaQuery("(min-width: 1201px)");
  const isEligibleForSplitLayout = Boolean(cityDetails && "cities" in cityDetails && cityDetails.imageUrlFHD.length > 1);
  const isSplitLayout = isWidthNeededForSplitLayout && isEligibleForSplitLayout;

  if (!cityDetails) {
    if (!navigator.onLine) {
      return (
        <ErrorScreen
          errorSummary="You are offline :("
          errorDetails="Double check your Internet connection and try again."
        />
      )
    } else if (fetchError) {
      return (
        <ErrorScreen
          errorSummary="Failed to load screenshot/city details :("
          errorDetails={
            <>
              <p className="mb-1">
                {fetchError.message}. Try searching in <NavLink to="/">Browse by Creator ID</NavLink>?
              </p>
            </>
          }
        />
      )
    } else if (isFetching || isCreatorCitiesFetching) {
      return (
        <PlaceholderDetails isCityGrouped={isCitiesGrouped} />
      );
    } else {
      // TODO: There has to be a better solution to this
      return (
        <ErrorScreen
          errorSummary="Failed to load screenshot/city details :("
          errorDetails={
            <>
              <p className="mb-1">
                Cannot find city with the name "{cityParam}" by creator "{cityCreator}". Try searching in <NavLink
                to="/">Browse by Creator ID</NavLink>?
              </p>
            </>
          }
        />
      );
    }
  }

  const imageUrlFHD = !Array.isArray(cityDetails.imageUrlFHD) ? [cityDetails.imageUrlFHD] : cityDetails.imageUrlFHD;
  const isLastPage = (Math.ceil(imageUrlFHD.length / DEFAULT_IMAGES_PER_PAGE) - page) === 0;

  return (
    <SplitLayoutContext value={isSplitLayout}>
      <div className={`${!(isEligibleForSplitLayout) && "main-wrapper gx-0"} flex-grow-1 ms-sm-5 me-sm-5 row align-items-start`}>
        <div className="px-0 px-xl-3">
          <div className="d-flex align-items-center mb-2">
            <OverlayTrigger overlay={<Tooltip>Back</Tooltip>}>
              <Button
                variant="outline"
                style={{border: "none", backgroundColor: "transparent"}}
                className="ps-0"
                aria-label="Back"
                onClick={() => navigate(-1)}
              >
                <ChevronLeft width="24" height="24"/>
              </Button>
            </OverlayTrigger>
            <h2
              className="mb-0">{cityDetails.cityName}{cityDetails.cityNameTranslated && `(${cityDetails.cityNameTranslated})`}</h2>
          </div>
          <h3 className="text-muted fs-5">by {cityDetails.creator.creatorName}</h3>
        </div>
        <div id="galleryContainer" className={`col-12 px-0 px-xl-3 ${isEligibleForSplitLayout && "col-xl-6 adaptive-overflow"}`} >
          <section id="gallery" className="mt-3 position-relative">
            <Suspense fallback={
              <img
                src={PlaceholderImg}
                alt=""
                className="w-100"
                style={{aspectRatio: "16/9"}}
              />
            }>
              <CityGallery page={page} setPage={setPage} city={cityDetails}/>
            </Suspense>
            {/* TODO: Move this button to the CityGallery component. Research React's useContext hook */}
            {(!isLastPage && !isSplitLayout) && (
              <Button
                variant="outline"
                style={{border: "none", backgroundColor: "transparent"}}
                className="p-0 d-flex justify-content-center position-relative m-auto mt-3"
                id="loadMoreBtn"
                onClick={() => setPage(page + 1)}
                onMouseEnter={() => setIsLoadMoreHovered(true)}
                onMouseLeave={() => setIsLoadMoreHovered(false)}
              >
                <p className="mb-0">Load More</p>
                <ChevronDown width="24" height="24"/>
              </Button>
            )}
          </section>
        </div>
        <div id="detailsContainer" className={`col-12 px-0 px-xl-3 ${isEligibleForSplitLayout && "col-xl-6 adaptive-overflow"}`} >
          <section
            id="details"
            className={`mt-3 position-relative ${(isLoadMoreHovered && !isLastPage && !("cities" in cityDetails)) && "load-more-hovered"}`}
          >
            <Card>
              <Card.Body>
                {cityDetails.showcasedModId && (
                  <section className="mb-3">
                    <h3>
                      <Card.Title>Showcased Asset/Map</Card.Title>
                    </h3>
                    {isFetching && !cityDetails.showcasedMod ? (
                      <PlaceholderFeatModCard/>
                    ) : (
                      <FeatModCard fetchError={error} showcasedMod={cityDetails.showcasedMod}/>
                    )}
                    {/*<a href={`https://mods.paradoxplaza.com/mods/${city.showcasedModId}/Windows`} target="_blank">*/}
                    {/*  {city.showcasedModId}*/}
                    {/*</a>*/}
                  </section>
                )}
                <section className="mb-3">
                  <h3>
                    <Card.Title>Stats</Card.Title>
                  </h3>
                  <OverlayTrigger overlay={<Tooltip>{cityDetails.createdAtFormattedDistance}</Tooltip>}>
                    <p className="d-inline-block text-muted mb-1">First posted
                      on: {new Date(cityDetails.createdAt).toLocaleString()}</p>
                  </OverlayTrigger>
                  <ul className="list-unstyled mb-0 row">
                    <li className="col-sm-6 col-md-4 col-xl-12 col-xxl-6 d-flex align-items-center gap-2">
                      <Person/>
                      <span className="visually-hidden">Population</span>
                      {cityDetails.cityPopulation.toLocaleString()}
                    </li>
                    <li className="col-sm-6 col-md-4 col-xl-12 col-xxl-6 d-flex align-items-center gap-2">
                      <Trophy/>
                      <span className="visually-hidden">Milestone</span>
                      {cityMilestones[cityDetails.cityMilestone - 1]}
                    </li>
                    <li className="col-sm-6 col-md-4 col-xl-12 col-xxl-6 d-flex align-items-center gap-2">
                      <Eye/>
                      <span className="visually-hidden">Unique Views</span>
                      {`${cityDetails.viewsCount.toLocaleString()} (Unique: ${cityDetails.uniqueViewsCount.toLocaleString()})`}
                    </li>
                    <li className="col-sm-6 col-md-4 col-xl-12 col-xxl-6 d-flex align-items-center gap-2">
                      <Heart/>
                      <span className="visually-hidden">Favorites</span>
                      {`${cityDetails.favoritesCount.toLocaleString()} (${cityDetails.favoritingPercentage}% of unique views)`}
                    </li>
                  </ul>
                </section>
                <section className="mb-3">
                  <h3>
                    <Card.Title>Map Used</Card.Title>
                  </h3>
                  {cityDetails.mapName ? (
                    <p>
                      <span>{cityDetails.mapName} (</span>
                      <a
                        target="_blank"
                        className="d-inline-flex align-items-center gap-2"
                        href={`https://mods.paradoxplaza.com/games/cities_skylines_2?search=${cityDetails.mapName}`}
                      >
                        Search on PDX Mods
                        <BoxArrowUpRight width="16" height="16"/>
                      </a>
                      )
                    </p>
                  ) : (
                    <p>This screenshot was posted before map sharing was possible.</p>
                  )}
                </section>
                <section className="mb-3">
                  <h3>
                    <Card.Title>Playset</Card.Title>
                  </h3>
                  <ModList city={cityDetails}/>
                </section>
                {/* Avoid displaying render settings for grouped cities */}
                {!Array.isArray(cityDetails?.imageUrlFHD) && (
                  <section>
                    <h3>
                      <Card.Title>Render Settings</Card.Title>
                    </h3>
                    <RenderSettings city={cityDetails}/>
                  </section>
                )}
              </Card.Body>
            </Card>
          </section>
          <section
            id="trends"
            className={`mt-3 position-relative ${(isLoadMoreHovered && !isLastPage && !("cities" in cityDetails)) && "load-more-hovered"}`}
          >
            <CityTrends city={cityDetails} isLoading={isFetching} fetchError={error}/>
          </section>
          {/* City insights only available for grouped screenshots */}
          {("cities" in cityDetails) && (
            <section
              id="insights"
              className={`mt-3 position-relative ${(isLoadMoreHovered && !isLastPage && !("cities" in cityDetails)) && "load-more-hovered"}`}
            >
              <CityInsights city={cityDetails}/>
            </section>
          )}
        </div>
      </div>
    </SplitLayoutContext>
  )

}
export default CityDetails

