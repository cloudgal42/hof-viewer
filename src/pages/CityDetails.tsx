import {Accordion, Button, Card} from "react-bootstrap";
import {useNavigate, useOutletContext} from "react-router";
import type {ContextType} from "../App.tsx";
import {ChevronLeft, Eye, Heart, Person, Trophy} from "react-bootstrap-icons";
import {CityGallery} from "../components/CityGallery.tsx";

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

  if (!city) {
    return (
      <p>City not found</p>
    )
  }

  // Get the imageUrlFHD key from city to prevent eslint from screaming TS2322
  const imageUrlFHD = !Array.isArray(city.imageUrlFHD) ? [city.imageUrlFHD] : city.imageUrlFHD;

  return (
    <div className="main-wrapper flex-grow-1 ms-sm-5 me-sm-5">
      <div className="d-flex align-items-center mb-2">
        <Button
          variant="outline"
          style={{border: "none", backgroundColor: "transparent"}}
          className="ps-0"
          onClick={() => navigate(-1)}
        >
          <span className="visually-hidden">Back</span>
          <ChevronLeft width="24" height="24" />
        </Button>
        <h2 className="mb-0">{city.cityName}{city.cityNameTranslated && `(${city.cityNameTranslated})`}</h2>
      </div>
      <h3 className="text-muted fs-5">by {city.creator.creatorName}</h3>
      <div className="mt-3">
        <CityGallery imageUrls={imageUrlFHD} />
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
                {`${city.favoritesCount.toLocaleString()} (${city.favoritingPercentage}% of unique views)`}
              </li>
            </ul>
            <Card.Title>Mods Used</Card.Title>
            <Accordion className="mb-3">
              <Accordion.Item eventKey="0">
                <Accordion.Header>{city.paradoxModIds.length} mods used</Accordion.Header>
                <Accordion.Body>
                  <ul className="list-unstyled d-flex flex-row flex-wrap gap-2 mb-0">
                    {city.paradoxModIds.length > 0 ? city.paradoxModIds.map(mod =>
                      <a key={mod} href={`https://mods.paradoxplaza.com/mods/${mod}/Windows`} target="_blank">
                        <li key={mod}>{mod}</li>
                      </a>
                    ) : (<p className="mb-0">This city does not use mods, or the creator has opted not to share their playsets.</p>)}
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

