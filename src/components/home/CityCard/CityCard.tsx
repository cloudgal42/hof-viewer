import {Badge, Card, OverlayTrigger, Tooltip} from "react-bootstrap";
import {Eye, Heart, Images, Person} from "react-bootstrap-icons";
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import {NavLink} from "react-router";
import type {City, GroupedCities} from "../../../interfaces/City.ts";
import {CreatorPreviewTrigger} from "../../misc/CreatorPreview/CreatorPreviewTrigger.tsx";
import {CardImg} from "../../misc/CardImg/CardImg.tsx";

interface CityCardProps {
  city: City | GroupedCities;
  setCity: (value: City | GroupedCities) => void;
  isCitiesGrouped: boolean;
}

export const CityCard = ({city, setCity, isCitiesGrouped}: CityCardProps) => {
  let thumbnailImgUrl;

  if (Array.isArray(city.imageUrlThumbnail)) {
    thumbnailImgUrl = city.imageUrlThumbnail[city.imageUrlThumbnail.length - 1];
  } else {
    thumbnailImgUrl = city.imageUrlThumbnail;
  }

  return (
    <Card>
      <div className="position-relative">
        <NavLink
          className="text-decoration-none"
          to={isCitiesGrouped ? `/city/${city.cityName}?groupStatus=on&creator=${city.creator.creatorName}` : `/city/${city.id}?groupStatus=off`}
          onClick={() => setCity(city)}
        >
          <CardImg
            wrapperClassName="d-inline"
            className="card-img-top"
            effect="black-and-white"
            alt=""
            height="170"
            style={{minWidth: "100%", aspectRatio: "16/9", objectFit: "cover"}}
            src={thumbnailImgUrl}
          />
        </NavLink>
        {Array.isArray(city.imageUrlFHD) && (
          <Badge pill bg="dark" className="position-absolute bg-opacity-50" style={{bottom: "0.5rem", right: "0.5rem"}}>
            <Images/>
            <span className="ms-1" aria-label="Total images:">{city.imageUrlFHD.length}</span>
          </Badge>
        )}
      </div>
      <Card.Body>
        <NavLink
          to={isCitiesGrouped ? `/city/${city.cityName}?groupStatus=on&creator=${city.creator.creatorName}` : `/city/${city.id}?groupStatus=off`}
          onClick={() => setCity(city)}
        >
          <h3>
            <Card.Title>{city.cityName}</Card.Title>
          </h3>
        </NavLink>
        <Card.Subtitle className="mb-1">{city.cityNameTranslated}</Card.Subtitle>
        <div style={{fontSize: "0.9rem"}} className="text-muted">
          <CreatorPreviewTrigger
            creator={city.creator}
            creatorName={city.creator.creatorName}
            showLinks={false}
          >
            <Card.Text className="d-inline-block mb-1">by {city.creator.creatorName}</Card.Text>
          </CreatorPreviewTrigger>
          <Card.Text className="d-flex mb-1 gap-2">
            <span className="d-flex flex-grow-1 align-items-center">
              <Person/>
              <span className="visually-hidden">Population</span>
              <span className="ms-1">{city.cityPopulation.toLocaleString()}</span>
            </span>
            <span className="d-flex flex-grow-1 align-items-center">
              <Eye/>
              <span className="visually-hidden">Unique Views</span>
              <span className="ms-1">{city.uniqueViewsCount.toLocaleString()}</span>
            </span>
            <span className="d-flex flex-grow-1 align-items-center">
              <Heart/>
              <span className="visually-hidden">Favorites</span>
              <span className="ms-1">{city.favoritesCount.toLocaleString()}</span>
            </span>
          </Card.Text>
          <Card.Text>
            <OverlayTrigger overlay={<Tooltip>{new Date(city.createdAt).toLocaleString()}</Tooltip>}>
              <span className="text-muted" style={{fontSize: "0.9rem"}}>
              {isCitiesGrouped ?
                `First posted ${city.createdAtFormattedDistance}` :
                city.createdAtFormattedDistance
              }
            </span>
            </OverlayTrigger>
          </Card.Text>
        </div>
      </Card.Body>
    </Card>

  )
}