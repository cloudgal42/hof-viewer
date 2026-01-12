import {Card} from "react-bootstrap";
import {Heart, Eye, Person} from "react-bootstrap-icons";
import {LazyLoadImage} from "react-lazy-load-image-component";
import PlaceholderImg from "../assets/placeholder.svg"
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import {NavLink} from "react-router";

export interface City {
  id: string;
  isApproved: boolean;
  isReported: boolean;
  favoritesCount: number;
  favoritingPercentage: number;
  viewsCount: number;
  uniqueViewsCount: number;
  cityName: string;
  cityNameLocale?: string;
  cityNameLatinized?: string;
  cityNameTranslated?: string;
  cityMilestone: number;
  cityPopulation: number;
  mapName?: string;
  imageUrlThumbnail: string;
  imageUrlFHD: string;
  imageUrl4K: string;
  shareParadoxModIds: boolean;
  paradoxModIds: number[];
  shareRenderSettings: boolean;
  creatorId: string;
  creator: Creator;
  createdAt: string;
  createdAtFormatted?: string;
  createdAtFormattedDistance: string;
  description?: string;
  renderSettings: object; // FIXME: Maybe define an interface for this?
  showcasedModId?: number;
  __favorited: boolean;
}

export interface GroupedCities extends Omit<City, "imageUrlFHD" | "imageUrl4K"> {
  imageUrlFHD: string[];
  imageUrl4K: string[];
}

export interface Creator {
  id: string;
  creatorName: string;
  creatorNameSlug: string;
  creatorNameLocale?: string;
  creatorNameLatinized?: string;
  creatorNameTranslated?: string;
  createdAt: string;
  socials: string[];
}

interface CityCardProps {
  city: City | GroupedCities;
  setCity: (value: City | GroupedCities) => void;
  isCitiesGrouped: boolean;
}

export const CityCard = ({city, setCity, isCitiesGrouped}: CityCardProps) => {
  let thumbnailImgUrl;

  if (Array.isArray(city.imageUrlFHD)) {
    thumbnailImgUrl = city.imageUrlFHD[city.imageUrlFHD.length - 1];
  } else {
    thumbnailImgUrl = city.imageUrlFHD;
  }

  return (
    <>
      <Card>
        <LazyLoadImage
          className="card-img-top"
          effect="black-and-white"
          alt=""
          placeholder={
            <Card.Img variant="top" src={PlaceholderImg}/>
          }
          src={thumbnailImgUrl}
        />
        <Card.Body>
          <NavLink
            to={`/city/${city.cityName}`}
            onClick={() => setCity(city)}
          >
            <Card.Title>{city.cityName}</Card.Title>
          </NavLink>
          <Card.Subtitle className="mb-1">{city.cityNameTranslated}</Card.Subtitle>
          <div style={{fontSize: "0.9rem"}} className="text-muted">
            <Card.Text className="d-block mb-1">by {city.creator.creatorName}</Card.Text>
            <Card.Text className="d-flex mb-1 gap-2">
              <span className="d-flex flex-grow-1 align-items-center">
                <Person/>
                <span className="ms-1">{city.cityPopulation.toLocaleString()}</span>
              </span>
              <span className="d-flex flex-grow-1 align-items-center">
                <Eye/>
                <span className="ms-1">{city.uniqueViewsCount.toLocaleString()}</span>
              </span>
              <span className="d-flex flex-grow-1 align-items-center">
                <Heart/>
                <span className="ms-1">{city.favoritesCount.toLocaleString()}</span>
              </span>
            </Card.Text>
            <Card.Text>
              <span className="text-muted" style={{fontSize: "0.9rem"}}>
                {isCitiesGrouped ?
                  `First posted ${city.createdAtFormattedDistance}` :
                  city.createdAtFormattedDistance
                }
              </span>
            </Card.Text>
          </div>
        </Card.Body>
      </Card>
    </>

  )
}