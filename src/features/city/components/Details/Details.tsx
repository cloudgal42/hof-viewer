import type {City, GroupedCities, ScreenshotRank} from "../../../../interfaces/City.ts";
import { Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { PlaceholderFeatModCard } from "../../../../components/details/FeatModCard/PlaceholderFeatModCard.tsx";
import { FeatModCard } from "../../../../components/details/FeatModCard/FeatModCard.tsx";
import {
  BoxArrowUpRight,
  CloudHail,
  CloudRain,
  Clouds,
  Eye,
  Heart,
  Moon,
  Person,
  Snow,
  Sun,
  Thunderbolt,
  Trophy,
} from "react-bootstrap-icons";
import { ModList } from "../../../../components/details/Playset/ModList.tsx";
import { RenderSettings } from "../RenderSettings/RenderSettings.tsx";
import Markdown from "react-markdown";
import {Conditions} from "../Conditions/Conditions.tsx";
import {ScreenshotRankBadge} from "../../../../components/screenshot/ScreenshotRankBadge/ScreenshotRankBadge.tsx";
import {getRankColor} from "../../helpers/RankColor.ts";

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

function rankTopPercent(rank: ScreenshotRank) {
  if (rank === "diamond") return "Top 3%";
  if (rank === "platinum") return "Top quarter";
  if (rank === "gold") return "Top half";
  if (rank === "silver") return "Top three quarters";
  if (rank === "bronze") return "Bottom quarter";
  return "FIXME%";
}

export const Details = (
  { cityDetails, isFetching, error, hideRank }: {
    cityDetails: City | GroupedCities;
    isFetching: boolean;
    error: Error | null;
    hideRank?: boolean;
  },
) => {
  return (
    <Card>
      <Card.Body>
        {!hideRank && cityDetails.rank && (
          <section className="mb-3">
            <h3>
              <Card.Title>Rank</Card.Title>
            </h3>
            <div className="d-flex align-items-center gap-2">
              <ScreenshotRankBadge rank={cityDetails.rank} size={36} />
              <div>
                <p className="fw-bold mb-0" style={{color: getRankColor(cityDetails.rank)}}>
                  {cityDetails.rank.charAt(0).toUpperCase() + cityDetails.rank.slice(1, cityDetails.rank.length)}
                </p>
                <small className="mb-0 text-secondary-emphasis">
                  {rankTopPercent(cityDetails.rank)} of ranked screenshots.{" "}
                </small>
              </div>
            </div>
          </section>
        )}
        {cityDetails.showcasedModId && (
          <section className="mb-3">
            <h3>
              <Card.Title>Showcased Asset/Map</Card.Title>
            </h3>
            {isFetching && !cityDetails.showcasedMod
              ? <PlaceholderFeatModCard />
              : cityDetails.showcasedMod && (
                <FeatModCard
                  fetchError={error}
                  showcasedMod={cityDetails.showcasedMod}
                />
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
          <OverlayTrigger
            overlay={
              <Tooltip>{cityDetails.createdAtFormattedDistance}</Tooltip>
            }
          >
            <p className="d-inline-block text-muted mb-1">
              First posted on:{" "}
              {new Date(cityDetails.createdAt).toLocaleString()}
            </p>
          </OverlayTrigger>
          <ul className="list-unstyled mb-0 row">
            <li className="col-sm-6 d-flex align-items-center gap-2">
              <Person />
              <span className="visually-hidden">Population</span>
              {cityDetails.cityPopulation.toLocaleString()}
            </li>
            <li className="col-sm-6 d-flex align-items-center gap-2">
              <Trophy />
              <span className="visually-hidden">Milestone</span>
              {cityMilestones[cityDetails.cityMilestone - 1]}
            </li>
            <li className="col-sm-6 d-flex align-items-center gap-2">
              <Eye />
              <span className="visually-hidden">Unique Views</span>
              {`${cityDetails.viewsCount.toLocaleString()} (Unique: ${cityDetails.uniqueViewsCount.toLocaleString()})`}
            </li>
            <li className="col-sm-6 d-flex align-items-center gap-2">
              <Heart />
              <span className="visually-hidden">Favorites</span>
              {`${cityDetails.favoritesCount.toLocaleString()} (${cityDetails.favoritingPercentage}% of unique views)`}
            </li>
          </ul>
        </section>
        {(!("cities" in cityDetails) && cityDetails.description) && (
          <section className="mb-3">
            <h3>
              <Card.Title>Description</Card.Title>
            </h3>
            <Markdown>
              {cityDetails.description}
            </Markdown>
          </section>
        )}
        <section className="mb-3">
          <h3>
            <Card.Title>Map Used</Card.Title>
          </h3>
          {cityDetails.mapName
            ? (
              <p>
                <span>{cityDetails.mapName} (</span>
                <a
                  target="_blank"
                  className="d-inline-flex align-items-center gap-2"
                  href={`https://mods.paradoxplaza.com/games/cities_skylines_2?search=${cityDetails.mapName}`}
                >
                  Search on PDX Mods
                  <BoxArrowUpRight width="16" height="16" />
                </a>
                )
              </p>
            )
            : (
              <p>
                This screenshot was posted before map sharing was possible.
              </p>
            )}
        </section>
        <section className="mb-3">
          <h3>
            <Card.Title>Playset</Card.Title>
          </h3>
          <ModList city={cityDetails} />
        </section>
        {/* Avoid displaying render settings for grouped cities */}
        {!Array.isArray(cityDetails?.imageUrlFHD) && (
          <>
            <section className="mb-3">
              <h3>
                <Card.Title>Conditions</Card.Title>
              </h3>
              <Conditions renderConditions={cityDetails.renderConditions} />
            </section>
            <section>
              <h3>
                <Card.Title>Render Settings</Card.Title>
              </h3>
              <RenderSettings city={cityDetails} />
            </section>
          </>
        )}
      </Card.Body>
    </Card>
  );
};
