import {Button, Card, OverlayTrigger, Tooltip} from "react-bootstrap";
import {NavLink, useNavigate, useOutletContext, useParams, useSearchParams} from "react-router";
import type {ContextType} from "../App.tsx";
import {BoxArrowUpRight, ChevronDown, ChevronLeft, Eye, Heart, Person, Trophy} from "react-bootstrap-icons";
import {lazy, Suspense, useEffect, useState} from "react";
import {DEFAULT_IMAGES_PER_PAGE} from "../components/details/CityGallery.tsx";

import PlaceholderImg from "../assets/placeholder.svg"
import SadChirper from "../assets/sadChirpyOutline.svg";
import {PlaceholderFeatModCard} from "../components/details/PlaceholderFeatModCard.tsx";
import {FeatModCard} from "../components/details/FeatModCard.tsx";
import {ModList} from "../components/details/ModList.tsx";
import {RenderSettings} from "../components/details/RenderSettings.tsx";
import {PlaceholderDetails} from "../components/details/PlaceholderDetails.tsx";
import {CityTrends} from "../components/details/CityTrends.tsx";

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
    city, setCity,
  } = useOutletContext<ContextType>();
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(1);
  const [isLoadMoreHovered, setIsLoadMoreHovered] = useState<boolean>(false);
  const [fetchStatus, setFetchStatus] = useState<number>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingExtraDetails, setisLoadingExtraDetails] = useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const cityParam = useParams().city;

  const isCitiesGrouped = searchParams.get("groupStatus") === "on";

  useEffect(() => {
    let ignore = false;
    if (!city && isCitiesGrouped || isCitiesGrouped) return;

    async function getCity() {
      if (!city) {
        setIsLoading(true);
      }

      setisLoadingExtraDetails(true);
      const res = await fetch(`https://halloffame.cs2.mtq.io/api/v1/screenshots/${cityParam}?favorites=true&views=true`);
      const data = await res.json();

      setFetchStatus(res.status);

      if (res.ok && !ignore) {
        setCity(data);
        setIsLoading(false);
        setisLoadingExtraDetails(false);
      } else {
        setisLoadingExtraDetails(false);
        setIsLoading(false);
      }

    }

    getCity();

    return () => {
      ignore = true;
    }

  }, []);


  // console.log(city);
  // console.log("Fetch status:", fetchStatus);
  // console.log("Is the page loading?", isLoading);

  if (!city) {
    if (fetchStatus !== 200 && fetchStatus || isCitiesGrouped) {
      return (
        <div className="d-flex flex-column align-items-center text-center">
          <img src={SadChirper} width="148" height="148" alt=""/>
          <p className="text-muted mb-1">
            {fetchStatus === 404 || !fetchStatus ?
              "No city/screenshot found :(" :
              "Something went wrong :("
            }
          </p>
          <p className="text-muted mb-1">
            {fetchStatus === 404 || !fetchStatus ?
              (
                <>
                  The city/screenshot you are looking for does not exist.
                  Try searching in <NavLink to="/">Browse by Creator ID</NavLink>?
                </>
              ) : (
                <>
                  HTTP status code: {fetchStatus}. Please wait for a while and try again.
                </>
              )
            }
          </p>
          <p className="text-muted mb-1">
            NOTE: For now grouped screenshots will be inaccessible upon page reload. Sorry about that!
          </p>
        </div>
      )
    } else if (isLoading || fetchStatus === 200) {
      return (
        <PlaceholderDetails />
      );
    } else {
      // TODO: There has to be a better solution to this
      return;
    }
  }

  const imageUrlFHD = !Array.isArray(city.imageUrlFHD) ? [city.imageUrlFHD] : city.imageUrlFHD;
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
        <h2 className="mb-0">{city.cityName}{city.cityNameTranslated && `(${city.cityNameTranslated})`}</h2>
      </div>
      <h3 className="text-muted fs-5">by {city.creator.creatorName}</h3>
      <section id="gallery" className="mt-3 position-relative">
        <Suspense fallback={
          <img
            src={PlaceholderImg}
            alt=""
            className="w-100"
            style={{aspectRatio: "16/9"}}
          />
        }>
          <CityGallery page={page} imageUrls={imageUrlFHD}/>
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
            {city.showcasedModId && (
              <section className="mb-3">
                <Card.Title>Showcased Asset/Map</Card.Title>
                {isLoadingExtraDetails || !city.showcasedMod ? (
                  <PlaceholderFeatModCard/>
                ) : (
                  <FeatModCard fetchStatus={fetchStatus} showcasedMod={city.showcasedMod}/>
                )}
                {/*<a href={`https://mods.paradoxplaza.com/mods/${city.showcasedModId}/Windows`} target="_blank">*/}
                {/*  {city.showcasedModId}*/}
                {/*</a>*/}
              </section>
            )}
            <section className="mb-3">
              <Card.Title>Stats</Card.Title>
              <OverlayTrigger overlay={<Tooltip>{city.createdAtFormattedDistance}</Tooltip>}>
                <p className="d-inline-block text-muted mb-1">First posted
                  on: {new Date(city.createdAt).toLocaleString()}</p>
              </OverlayTrigger>
              <ul className="list-unstyled mb-0 row">
                <li className="col-sm-6 col-md-4 col-lg-3 d-flex align-items-center gap-2">
                  <Person/>
                  <span className="visually-hidden">Population</span>
                  {city.cityPopulation.toLocaleString()}
                </li>
                <li className="col-sm-6 col-md-4 col-lg-3 d-flex align-items-center gap-2">
                  <Trophy/>
                  <span className="visually-hidden">Milestone</span>
                  {cityMilestones[city.cityMilestone - 1]}
                </li>
                <li className="col-sm-6 col-md-4 col-lg-3 d-flex align-items-center gap-2">
                  <Eye/>
                  <span className="visually-hidden">Unique Views</span>
                  {`${city.viewsCount.toLocaleString()} (Unique: ${city.uniqueViewsCount.toLocaleString()})`}
                </li>
                <li className="col-sm-6 col-md-4 col-lg-3 d-flex align-items-center gap-2">
                  <Heart/>
                  <span className="visually-hidden">Favorites</span>
                  {`${city.favoritesCount.toLocaleString()} (${city.favoritingPercentage}% of unique views)`}
                </li>
              </ul>
            </section>
            <section className="mb-3">
              <Card.Title>Map Used</Card.Title>
              {city.mapName ? (
                <p>
                  <span>{city.mapName} (</span>
                  <a
                    target="_blank"
                    className="d-inline-flex align-items-center gap-2"
                    href={`https://mods.paradoxplaza.com/games/cities_skylines_2?search=${city.mapName}`}
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
              <ModList city={city}/>
            </section>
            <section>
              <Card.Title>Render Settings</Card.Title>
              <RenderSettings city={city} />
            </section>
          </Card.Body>
        </Card>
      </section>
      {!Array.isArray(city.imageUrlFHD) && (
        <section
          id="trends"
          className={`mt-3 position-relative ${(isLoadMoreHovered && !isLastPage) && "load-more-hovered"}`}
        >
          <CityTrends city={city} isLoading={isLoadingExtraDetails} />
        </section>
      )}
    </div>
  )

}
export default CityDetails

