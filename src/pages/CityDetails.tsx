import 'photoswipe/dist/photoswipe.css'

import {Accordion, Card, Image} from "react-bootstrap";
import {useOutletContext} from "react-router";
import type {ContextType} from "../App.tsx";
import {Eye, Heart, Person, Trophy} from "react-bootstrap-icons";
import {Gallery, Item} from "react-photoswipe-gallery";

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

  if (!city) {
    return (
      <p>City not found</p>
    )
  }

  // Get the imageUrlFHD key from city to prevent eslint from screaming TS2322
  const {imageUrlFHD} = city;

  return (
    <div className="main-wrapper flex-grow-1 ms-sm-5 me-sm-5">
      <h2>{city.cityName}{city.cityNameTranslated && `(${city.cityNameTranslated})`}</h2>
      <h3 className="text-muted fs-5">by {city.creator.creatorName}</h3>
      <div className="mt-3">
        <Gallery>
          <div className="img-gallery-container d-flex flex-wrap gap-1">
            {Array.isArray(imageUrlFHD) ? (
              imageUrlFHD.map((imageUrl, i) =>
                <Item
                  key={i}
                  original={imageUrl}
                  // TODO: Use thumbnail images for thumbnail instead
                  thumbnail={imageUrl}
                  width="1920"
                  height="1080"
                  alt=""
                >
                  {({ref, open}) => (
                    <Image key={i} ref={ref} alt="" onClick={open} src={imageUrl} fluid/>
                  )}
                </Item>
              )
            ) : (
              <Item
                original={imageUrlFHD}
                // TODO: Use thumbnail images for thumbnail instead
                thumbnail={imageUrlFHD}
                width="1920"
                height="1080"
                alt=""
              >
                {({ref, open}) => (
                  <Image ref={ref} alt="" onClick={open} src={imageUrlFHD ?? ""} fluid/>
                )}
              </Item>
            )}
          </div>
        </Gallery>
      </div>
      <div className="mt-3">
        <Card>
          <Card.Body>
            <Card.Title>Stats</Card.Title>
            <p className="text-muted mb-1">First posted on: {city.createdAtFormatted}</p>
            <ul className="list-unstyled row">
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
                {`${city.favoritesCount.toLocaleString()} (${city.favoritingPercentage}% of views)`}
              </li>
            </ul>
            <Card.Title>Mods Used</Card.Title>
            <Accordion className="mb-2">
              <Accordion.Item eventKey="0">
                <Accordion.Header>{city.paradoxModIds.length} mods used</Accordion.Header>
                <Accordion.Body>
                  <ul className="list-unstyled d-flex flex-row flex-wrap gap-2">
                    {city.paradoxModIds.length > 0 ? city.paradoxModIds.map(mod =>
                      <a key={mod} href={`https://mods.paradoxplaza.com/mods/${mod}/Windows`} target="_blank">
                        <li key={mod}>{mod}</li>
                      </a>
                    ) : (<p>This city does not use mods.</p>)}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
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
          </Card.Body>
        </Card>
      </div>
    </div>
  )

}

