import { Badge, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, Heart, Images, Person } from "react-bootstrap-icons";
import { NavLink } from "react-router";
import type { City, GroupedCities } from "../../../interfaces/City.ts";
import { CreatorPreviewTrigger } from "../../misc/CreatorPreview/CreatorPreviewTrigger.tsx";
import { CardImg } from "../../misc/CardImg/CardImg.tsx";

import "react-lazy-load-image-component/src/effects/black-and-white.css";
import "../../../css/components/CityCard.css";
import {useTranslation} from "../../../hooks/useTranslation.ts";

interface CityCardProps {
  city: City | GroupedCities;
  setCity: (value: City | GroupedCities) => void;
}

export const CityCard = ({ city, setCity }: CityCardProps) => {
  const {
    titleCityName,
    subCityName,
    creatorName,
  } = useTranslation();
  let thumbnailImgUrl;
  const isCitiesGrouped = "cities" in city;

  if (Array.isArray(city.imageUrlThumbnail)) {
    thumbnailImgUrl = city.imageUrlThumbnail[city.imageUrlThumbnail.length - 1];
  } else {
    thumbnailImgUrl = city.imageUrlThumbnail;
  }

  return (
    <Card className="city-card">
      <NavLink
        className="text-decoration-none"
        to={isCitiesGrouped
          ? `/city/${city.cityName}?groupStatus=on&creator=${city.creator.creatorName}`
          : `/city/${city.id}?groupStatus=off`}
        onClick={() => setCity(city)}
      >
        <div className="position-relative overflow-hidden">
          <CardImg
            wrapperClassName="d-inline"
            className="card-img-top"
            effect="black-and-white"
            alt=""
            height="170"
            style={{
              minWidth: "100%",
              aspectRatio: "16/9",
              objectFit: "cover",
            }}
            src={thumbnailImgUrl}
          />
          {Array.isArray(city.imageUrlFHD) && (
            <Badge
              pill
              bg="dark"
              className="position-absolute bg-opacity-50"
              style={{ bottom: "0.5rem", right: "0.5rem" }}
            >
              <Images />
              <span className="ms-1" aria-label="Total images:">
                {city.imageUrlFHD.length}
              </span>
            </Badge>
          )}
        </div>
        <Card.Body>
          <h3>
            <Card.Title>{titleCityName(city)}</Card.Title>
          </h3>
          <Card.Subtitle className="mb-1">
            {subCityName(city)}
          </Card.Subtitle>
          <div style={{ fontSize: "0.9rem" }} className="text-muted">
            <CreatorPreviewTrigger
              creator={city.creator}
              creatorName={creatorName(city.creator)}
              showLinks={false}
            >
              <Card.Text className="d-inline-block mb-1">
                by {creatorName(city.creator)}
              </Card.Text>
            </CreatorPreviewTrigger>
            <Card.Text className="d-flex mb-1 gap-2">
              <span className="d-flex flex-grow-1 align-items-center">
                <Person />
                <span className="visually-hidden">Population</span>
                <span className="ms-1">
                  {city.cityPopulation.toLocaleString()}
                </span>
              </span>
              <span className="d-flex flex-grow-1 align-items-center">
                <Eye />
                <span className="visually-hidden">Unique Views</span>
                <span className="ms-1">
                  {city.uniqueViewsCount.toLocaleString()}
                </span>
              </span>
              <span className="d-flex flex-grow-1 align-items-center">
                <Heart />
                <span className="visually-hidden">Favorites</span>
                <span className="ms-1">
                  {city.favoritesCount.toLocaleString()}
                </span>
              </span>
            </Card.Text>
            <Card.Text>
              <OverlayTrigger
                overlay={
                  <Tooltip>{new Date(city.createdAt).toLocaleString()}</Tooltip>
                }
              >
                <span className="text-muted" style={{ fontSize: "0.9rem" }}>
                  {isCitiesGrouped
                    ? `First posted ${city.createdAtFormattedDistance}`
                    : city.createdAtFormattedDistance}
                </span>
              </OverlayTrigger>
            </Card.Text>
          </div>
        </Card.Body>
      </NavLink>
    </Card>
  );
};
