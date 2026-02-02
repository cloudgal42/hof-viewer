import {Button, Card, OverlayTrigger, Tooltip} from "react-bootstrap";
import {NavLink, useNavigate, useOutletContext, useParams, useSearchParams} from "react-router";
import type {ContextType} from "../App.tsx";
import {BoxArrowUpRight, ChevronDown, ChevronLeft, Eye, Heart, Person, Trophy} from "react-bootstrap-icons";
import {lazy, Suspense, useState} from "react";
import {DEFAULT_IMAGES_PER_PAGE} from "../components/details/CityGallery.tsx";

import PlaceholderImg from "../assets/placeholder.svg"
import {ModList} from "../components/details/ModList.tsx";
import {RenderSettings} from "../components/details/RenderSettings.tsx";
import {PlaceholderDetails} from "../components/details/PlaceholderDetails.tsx";
import {CityTrends} from "../components/details/CityTrends.tsx";
import {ErrorScreen} from "../components/ErrorScreen.tsx";
import {useQuery} from "@tanstack/react-query";
import type {City} from "../interfaces/City.ts";
import {PlaceholderFeatModCard} from "../components/details/PlaceholderFeatModCard.tsx";
import {FeatModCard} from "../components/details/FeatModCard.tsx";
import * as React from "react";

const CityGallery = lazy(() => import("../components/details/CityGallery.tsx"));

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

  const {error, data, isFetching} = useQuery<City>({
    queryKey: ["city", {id: cityParam}],
    queryFn: async () => {
      // maybe FIXME?
      if (isCitiesGrouped) return Promise.reject(new Error(`For now grouped screenshots will be inaccessible upon page reload. Sorry about that!`));

      const res = await fetch(`${import.meta.env.VITE_HOF_SERVER}/screenshots/${cityParam}?favorites=true&views=true`);
      const data = await res.json();

      if (!res.ok) {
        return Promise.reject(new Error(`${data.statusCode}: ${data.message}`));
      }

      return data;
    },
    refetchOnWindowFocus: false,
    enabled: Boolean(!city?.favorites && !city?.views || city?.showcasedModId),
    retry: false,
  });

  // console.log(data);

  const cityDetails = data || city;

  if (!cityDetails) {
    if (!navigator.onLine) {
      return (
        <ErrorScreen
          errorSummary="You are offline :("
          errorDetails="Double check your Internet connection and try again."
        />
      )
    } else if (error || isCitiesGrouped) {
      return (
        <ErrorScreen
          errorSummary="Failed to load screenshot/city details :("
          errorDetails={
            <>
              <p className="mb-1">
                {error?.message ? `${error.message} ` :
                  "For now grouped screenshots will be inaccessible upon page reload. Sorry about that!"
                }
                Try searching in <NavLink to="/">Browse by Creator ID</NavLink>?
              </p>

            </>
          }
        />
      )
    } else if (isFetching) {
      return (
        <PlaceholderDetails/>
      );
    } else {
      // TODO: There has to be a better solution to this
      return;
    }
  }

  const imageUrlFHD = !Array.isArray(cityDetails.imageUrlFHD) ? [cityDetails.imageUrlFHD] : cityDetails.imageUrlFHD;
  const isLastPage = (Math.ceil(imageUrlFHD.length / DEFAULT_IMAGES_PER_PAGE) - page) === 0;

  return (
    <div className="main-wrapper flex-grow-1 ms-sm-5 me-sm-5">
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
      <section id="gallery" className="mt-3 position-relative">
        <Suspense fallback={
          <img
            src={PlaceholderImg}
            alt=""
            className="w-100"
            style={{aspectRatio: "16/9"}}
          />
        }>
          <CityGallery page={page} city={cityDetails} />
        </Suspense>
        {/* TODO: Move this button to the CityGallery component. Research React's useContext hook */}
        {!isLastPage && (
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
      <section
        id="details"
        className={`mt-3 position-relative ${(isLoadMoreHovered && !isLastPage) && "load-more-hovered"}`}
      >
        <Card>
          <Card.Body>
            {cityDetails.showcasedModId && (
              <section className="mb-3">
                <Card.Title>Showcased Asset/Map</Card.Title>
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
              <Card.Title>Stats</Card.Title>
              <OverlayTrigger overlay={<Tooltip>{cityDetails.createdAtFormattedDistance}</Tooltip>}>
                <p className="d-inline-block text-muted mb-1">First posted
                  on: {new Date(cityDetails.createdAt).toLocaleString()}</p>
              </OverlayTrigger>
              <ul className="list-unstyled mb-0 row">
                <li className="col-sm-6 col-md-4 col-lg-3 d-flex align-items-center gap-2">
                  <Person/>
                  <span className="visually-hidden">Population</span>
                  {cityDetails.cityPopulation.toLocaleString()}
                </li>
                <li className="col-sm-6 col-md-4 col-lg-3 d-flex align-items-center gap-2">
                  <Trophy/>
                  <span className="visually-hidden">Milestone</span>
                  {cityMilestones[cityDetails.cityMilestone - 1]}
                </li>
                <li className="col-sm-6 col-md-4 col-lg-3 d-flex align-items-center gap-2">
                  <Eye/>
                  <span className="visually-hidden">Unique Views</span>
                  {`${cityDetails.viewsCount.toLocaleString()} (Unique: ${cityDetails.uniqueViewsCount.toLocaleString()})`}
                </li>
                <li className="col-sm-6 col-md-4 col-lg-3 d-flex align-items-center gap-2">
                  <Heart/>
                  <span className="visually-hidden">Favorites</span>
                  {`${cityDetails.favoritesCount.toLocaleString()} (${cityDetails.favoritingPercentage}% of unique views)`}
                </li>
              </ul>
            </section>
            <section className="mb-3">
              <Card.Title>Map Used</Card.Title>
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
              <Card.Title>Playset</Card.Title>
              <ModList city={cityDetails}/>
            </section>
            <section>
              <Card.Title>Render Settings</Card.Title>
              <RenderSettings city={cityDetails}/>
            </section>
          </Card.Body>
        </Card>
      </section>
      <section
        id="trends"
        className={`mt-3 position-relative ${(isLoadMoreHovered && !isLastPage) && "load-more-hovered"}`}
      >
        <CityTrends city={cityDetails} isLoading={isFetching} fetchError={error}/>
      </section>
    </div>
  )

}
export default CityDetails

