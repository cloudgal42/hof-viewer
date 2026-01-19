import {Accordion, Button, Card, OverlayTrigger, Tooltip} from "react-bootstrap";
import {useNavigate, useOutletContext} from "react-router";
import type {ContextType} from "../App.tsx";
import {ChevronDown, ChevronLeft, Eye, Heart, Person, Trophy} from "react-bootstrap-icons";
import {lazy, useState} from "react";

import {DEFAULT_IMAGES_PER_PAGE} from "../components/CityGallery.tsx";
// import ModCard from "../components/ModCard.tsx";

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
    city,
  } = useOutletContext<ContextType>();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [isLoadMoreHovered, setIsLoadMoreHovered] = useState<boolean>(false);

  if (!city) {
    return (
      <p>City not found</p>
    )
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
      <section id="details"
               className={`mt-3 position-relative ${(isLoadMoreHovered && !isLastPage) && "load-more-hovered"}`}>
        <Card>
          <Card.Body>
            {city.showcasedModId && (
              <section className="mb-3">
                <Card.Title>Showcased Asset/Map</Card.Title>
                {/*<ModCard modId={city.showcasedModId}/>*/}
                <a href={`https://mods.paradoxplaza.com/mods/${city.showcasedModId}/Windows`} target="_blank">
                  {city.showcasedModId}
                </a>
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

