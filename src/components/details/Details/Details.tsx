import type {City, GroupedCities} from "../../../interfaces/City.ts";
import {Card, OverlayTrigger, Tooltip} from "react-bootstrap";
import {PlaceholderFeatModCard} from "../FeatModCard/PlaceholderFeatModCard.tsx";
import {FeatModCard} from "../FeatModCard/FeatModCard.tsx";
import {BoxArrowUpRight, Eye, Heart, Person, Trophy} from "react-bootstrap-icons";
import {ModList} from "../Playset/ModList.tsx";
import {RenderSettings} from "../RenderSettings/RenderSettings.tsx";

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
];

export const Details = (
  {cityDetails, isFetching, error} :
  {cityDetails: City | GroupedCities, isFetching: boolean, error: Error | null}
) => {
  return (
    <Card>
      <Card.Body>
        {cityDetails.showcasedModId && (
          <section className="mb-3">
            <h3>
              <Card.Title>Showcased Asset/Map</Card.Title>
            </h3>
            {isFetching && !cityDetails.showcasedMod ? (
              <PlaceholderFeatModCard/>
            ) : cityDetails.showcasedMod && (
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
            <li className="col-sm-6 d-flex align-items-center gap-2">
              <Person/>
              <span className="visually-hidden">Population</span>
              {cityDetails.cityPopulation.toLocaleString()}
            </li>
            <li className="col-sm-6 d-flex align-items-center gap-2">
              <Trophy/>
              <span className="visually-hidden">Milestone</span>
              {cityMilestones[cityDetails.cityMilestone - 1]}
            </li>
            <li className="col-sm-6 d-flex align-items-center gap-2">
              <Eye/>
              <span className="visually-hidden">Unique Views</span>
              {`${cityDetails.viewsCount.toLocaleString()} (Unique: ${cityDetails.uniqueViewsCount.toLocaleString()})`}
            </li>
            <li className="col-sm-6 d-flex align-items-center gap-2">
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
  )
}