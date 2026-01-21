import {Accordion, Button, Card, OverlayTrigger, Placeholder, Tooltip} from "react-bootstrap";
import {NavLink, useNavigate, useOutletContext, useParams, useSearchParams} from "react-router";
import type {ContextType} from "../App.tsx";
import {ChevronDown, ChevronLeft, Eye, Heart, Person, Trophy} from "react-bootstrap-icons";
import {lazy, useEffect, useState} from "react";
import {DEFAULT_IMAGES_PER_PAGE} from "../components/CityGallery.tsx";
// import ModCard from "../components/ModCard.tsx";

import PlaceholderImg from "../assets/placeholder.svg"
import SadChirper from "../assets/sadChirpyOutline.svg";
import {PlaceholderModCard} from "../components/PlaceholderModCard.tsx";
import ModCard from "../components/ModCard.tsx";

const CityGallery = lazy(() => import("../components/CityGallery.tsx"));

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

export const CityDetails = () => {
  const {
    city, setCity,
  } = useOutletContext<ContextType>();
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(1);
  const [isLoadMoreHovered, setIsLoadMoreHovered] = useState<boolean>(false);
  const [fetchStatus, setFetchStatus] = useState<number>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMod, setIsLoadingMod] = useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const cityParam = useParams().city;

  const isCitiesGrouped = searchParams.get("groupStatus") === "on";

  useEffect(() => {
    let ignore = false;
    if (!city && isCitiesGrouped || isCitiesGrouped || city && !city.showcasedModId) return;

    async function getCity() {
      if (!city) {
        setIsLoading(true);
      }
      setIsLoadingMod(true);
      const res = await fetch(`https://halloffame.cs2.mtq.io/api/v1/screenshots/${cityParam}`);
      const data = await res.json();

      setFetchStatus(res.status);

      if (res.ok && !ignore) {
        setCity(data);
        setIsLoading(false);
        setIsLoadingMod(false);
      } else {
        setIsLoadingMod(false);
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
        <div className="main-wrapper flex-grow-1 ms-sm-5 me-sm-5">
          <div className="mb-2">
            <h2 className="mb-0">
              <Placeholder animation="glow">
                <Placeholder xs={5} size="lg" />
              </Placeholder>
            </h2>
          </div>
          <h3 className="text-muted fs-5">
            <Placeholder animation="glow">
              <Placeholder xs={3} size="lg" />
            </Placeholder>
          </h3>
          <section id="gallery" className="mt-3 position-relative">
            <img
              src={PlaceholderImg}
              className="w-100 object-fit-contain"
              style={{aspectRatio: "16/9"}}
              alt=""
            />
          </section>
          <section
            id="details"
            className="mt-3 position-relative"
          >
            <Card>
              <Card.Body>
                <section className="mb-3">
                  <Placeholder as={Card.Title} xs={5} />
                  <PlaceholderModCard />
                </section>
                <section className="mb-3">
                  <Placeholder as={Card.Title} xs={5} />
                  <Placeholder className="mb-1" animation="glow">
                    <Placeholder as={Card.Text} xs={7} />
                  </Placeholder>
                  <ul className="list-unstyled mb-0 row">
                    <li className="d-flex gap-2 align-items-center col-sm-6 col-md-4 col-lg-3">
                      <Person/>
                      <span className="visually-hidden">Population</span>
                      <Placeholder as={Card.Text} animation="glow" className="flex-grow-1">
                        <Placeholder xs={1} />
                      </Placeholder>
                    </li>
                    <li className="d-flex gap-2 align-items-center col-sm-6 col-md-4 col-lg-3">
                      <Trophy/>
                      <span className="visually-hidden">Milestone</span>
                      <Placeholder as={Card.Text} animation="glow" className="flex-grow-1">
                        <Placeholder xs={1} />
                      </Placeholder>
                    </li>
                    <li className="d-flex gap-2 align-items-center col-sm-6 col-md-4 col-lg-3">
                      <Eye/>
                      <span className="visually-hidden">Unique Views</span>
                      <Placeholder as={Card.Text} animation="glow" className="flex-grow-1">
                        <Placeholder xs={1} />
                      </Placeholder>
                    </li>
                    <li className="d-flex gap-2 align-items-center col-sm-6 col-md-4 col-lg-3">
                      <Heart/>
                      <span className="visually-hidden">Favorites</span>
                      <Placeholder as={Card.Text} animation="glow" className="flex-grow-1">
                        <Placeholder xs={1} />
                      </Placeholder>
                    </li>
                  </ul>
                </section>
                <section className="mb-3">
                  <Placeholder as={Card.Title} xs={5} />
                  <Card>
                    <Card.Body>
                      <Placeholder as={Card.Text} animation="glow">
                        <Placeholder xs={4} />
                      </Placeholder>
                    </Card.Body>
                  </Card>
                </section>
                <section>
                  <Placeholder as={Card.Title} xs={5} />
                  <Placeholder as={Card.Text} animation="glow">
                    <Placeholder className="d-block mb-2" xs={6} />
                    <Placeholder className="d-block mb-2" xs={4} />
                    <Placeholder className="d-block mb-2" xs={5} />
                    <Placeholder className="d-block mb-2" xs={4} />
                    <Placeholder className="d-block mb-2" xs={3} />
                  </Placeholder>
                </section>
              </Card.Body>
            </Card>
          </section>
        </div>
      );
    } else {
      // TODO: There has to be a better solution to this
      return;
    }
  }

  // Get the imageUrlFHD key from city to prevent eslint from screaming TS2322
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
        <CityGallery page={page} imageUrls={imageUrlFHD}/>
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
                {isLoadingMod || !city.showcasedMod ? (
                  <PlaceholderModCard />
                ) : (
                  <ModCard fetchStatus={fetchStatus} showcasedMod={city.showcasedMod} />
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
              <Card.Title>Mods Used</Card.Title>
              {city.shareParadoxModIds ? (
                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>{city.paradoxModIds.length} mods used</Accordion.Header>
                    <Accordion.Body>
                      <ul className="list-unstyled d-flex flex-row flex-wrap gap-2 mb-0">
                        {city.paradoxModIds.length > 0 ? city.paradoxModIds.map(mod =>
                          <a key={mod} href={`https://mods.paradoxplaza.com/mods/${mod}/Windows`} target="_blank">
                            <li key={mod}>{mod}</li>
                          </a>
                        ) : (<p className="mb-0">This city does not use mods.</p>)}
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              ) : (
                <p>Creator has opted not to share their playsets.</p>
              )}
            </section>
            <section>
              <Card.Title>Render Settings</Card.Title>
              {Object.entries(city.renderSettings).length !== 0 ? (
                <ul>
                  {Object.entries(city.renderSettings).map(([key, value]) =>
                    <li key={key}>{`${key}: ${value}`}</li>
                  )}
                </ul>
              ) : (
                <p>No render settings found.</p>
              )}
            </section>
          </Card.Body>
        </Card>
      </section>
    </div>
  )

}

